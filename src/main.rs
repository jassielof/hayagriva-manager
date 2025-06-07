use anyhow::{Context, Result};
use clap::{Parser, ValueEnum};
use hayagriva::Library;
use std::fs;
use std::io::{self, Write};
use std::path::PathBuf;

#[derive(Debug, Copy, Clone, ValueEnum)]
enum InputFormat {
    Yaml,
    Json,
    Toml,
}

#[derive(Parser, Debug)]
#[command(author, version, about = "Export Hayagriva data to BibLaTeX format")]
struct Args {
    /// Input file path
    #[arg(short, long)]
    input: PathBuf,

    /// Output file path (if not provided, output to stdout)
    #[arg(short, long)]
    output: Option<PathBuf>,

    /// Input file format
    #[arg(short, long, value_enum, default_value_t = InputFormat::Yaml)]
    format: InputFormat,
}

fn main() -> Result<()> {
    let args = Args::parse();

    // Read input file
    let content = fs::read_to_string(&args.input)
        .with_context(|| format!("Failed to read input file: {}", args.input.display()))?;

    // Parse content based on format
    let library = match args.format {
        InputFormat::Yaml => serde_yaml::from_str::<Library>(&content)
            .context("Failed to parse YAML input")?,
        InputFormat::Json => serde_json::from_str::<Library>(&content)
            .context("Failed to parse JSON input")?,
        InputFormat::Toml => toml::from_str::<Library>(&content)
            .context("Failed to parse TOML input")?,
    };

    // Generate BibLaTeX output
    let biblatex = export_to_biblatex(&library)?;

    // Write output
    match args.output {
        Some(path) => {
            fs::write(&path, biblatex)
                .with_context(|| format!("Failed to write to output file: {}", path.display()))?;
        }
        None => {
            io::stdout().write_all(biblatex.as_bytes())?;
        }
    }

    Ok(())
}

/// Convert a Hayagriva Library to BibLaTeX format
fn export_to_biblatex(library: &Library) -> Result<String> {
    // This is where we'll implement the conversion logic
    let mut output = String::new();

    for entry in library.iter() {
        // Start with the entry type and key
        let entry_type = match *entry.entry_type() {
            hayagriva::types::EntryType::Article => "article",
            hayagriva::types::EntryType::Book => "book",
            hayagriva::types::EntryType::Chapter => "incollection",
            hayagriva::types::EntryType::Periodical => "periodical",
            hayagriva::types::EntryType::Report => "report",
            hayagriva::types::EntryType::Thesis => "thesis",
            hayagriva::types::EntryType::Proceedings => "proceedings",
            // Use "misc" for any other types
            _ => "misc",
        };

        output.push_str(&format!("@{}{{{}",
            entry_type,
            entry.key()
        ));

        // Add title
        if let Some(title) = entry.title() {
            output.push_str(&format!(",\n  title = {{{}}}",
                escape_latex(title.to_string())
            ));
        }

        // Add authors
        if let Some(authors) = entry.authors() {
            let author_str = authors
                .iter()
                .map(format_person_name)
                .collect::<Vec<_>>()
                .join(" and ");

            output.push_str(&format!(",\n  author = {{{}}}",
                escape_latex(author_str)
            ));
        }

        // Add date
        if let Some(date) = entry.date() {
            let date_str = match (date.year, date.month, date.day) {
                (y, Some(m), Some(d)) => format!("{:04}-{:02}-{:02}", y, m, d),
                (y, Some(m), None) => format!("{:04}-{:02}", y, m),
                (y, None, None) => format!("{:04}", y),
                _ => "".to_string(),
            };

            output.push_str(&format!(",\n  date = {{{}}}",
                date_str
            ));
        }

        // Add publisher
        if let Some(publisher) = entry.publisher() {
            // Publisher doesn't implement ToString directly, so we need to extract its components
            let publisher_str = if let Some(name) = publisher.name() {
                if let Some(location) = publisher.location() {
                    format!("{}, {}", name, location)
                } else {
                    name.to_string()
                }
            } else {
                "".to_string()
            };

            if !publisher_str.is_empty() {
                output.push_str(&format!(",\n  publisher = {{{}}}",
                    escape_latex(publisher_str)
                ));
            }
        }

        // Add URL
        if let Some(url) = entry.url() {
            output.push_str(&format!(",\n  url = {{{}}}",
                url
            ));
        }

        // Add DOI
        if let Some(doi) = entry.doi() {
            output.push_str(&format!(",\n  doi = {{{}}}",
                doi
            ));
        }

        // Add page range
        if let Some(pages) = entry.page_range() {
            output.push_str(&format!(",\n  pages = {{{}}}",
                pages
            ));
        }

        // Add journal/parent title for articles
        if *entry.entry_type() == hayagriva::types::EntryType::Article {
            // Access parents through the parents() method - it returns a slice, not an Option
            let parents = entry.parents();
            if !parents.is_empty() {
                let parent = &parents[0];

                if let Some(parent_title) = parent.title() {
                    output.push_str(&format!(",\n  journaltitle = {{{}}}",
                        escape_latex(parent_title.to_string())
                    ));
                }

                // Add volume
                if let Some(volume) = parent.volume() {
                    output.push_str(&format!(",\n  volume = {{{}}}",
                        volume
                    ));
                }

                // Add issue/number
                if let Some(issue) = parent.issue() {
                    output.push_str(&format!(",\n  number = {{{}}}",
                        issue
                    ));
                }
            }
        }

        // Close the entry
        output.push_str("\n}\n\n");
    }

    Ok(output)
}

/// Format a person's name in BibLaTeX style
fn format_person_name(person: &hayagriva::types::Person) -> String {
    // Try to get a string representation of the person
    // Since we can't directly access internal fields or call methods,
    // let's try a different approach

    // Convert to string representation and inspect it
    let s = format!("{:?}", person);

    // Handle common formats based on debug output
    // This is a bit hacky, but should work as a fallback
    if s.contains("last: ") && s.contains("first: ") {
        // Try to extract first and last name from debug representation
        let parts: Vec<&str> = s.split(", ").collect();
        let mut last = "";
        let mut first = "";

        for part in parts {
            if part.starts_with("last: ") {
                last = &part[6..];
                // Remove possible quotes
                last = last.trim_matches('"');
            } else if part.starts_with("first: ") {
                first = &part[7..];
                // Remove possible quotes
                first = first.trim_matches('"');
            }
        }

        if !last.is_empty() {
            if !first.is_empty() {
                format!("{}, {}", last, first)
            } else {
                last.to_string()
            }
        } else {
            // If we couldn't extract structured parts, return the raw string
            // But clean it up to remove the debug formatting
            s.replace("Person { ", "").replace(" }", "")
        }
    } else {
        // If we can't parse the debug format, just return a cleaned version
        s.replace("Person { ", "").replace(" }", "").replace("name: ", "").trim_matches('"').to_string()
    }
}

/// Simple function to escape special LaTeX characters
fn escape_latex(text: String) -> String {
    text.replace("&", "\\&")
        .replace("#", "\\#")
        .replace("$", "\\$")
        .replace("%", "\\%")
        .replace("_", "\\_")
        .replace("{", "\\{")
        .replace("}", "\\}")
        .replace("~", "\\~")
        .replace("^", "\\^")
        .replace("\\", "\\textbackslash{}")
}