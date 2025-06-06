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
        let entry_type = match entry.entry_type {
            hayagriva::types::EntryType::Article => "article",
            hayagriva::types::EntryType::Book => "book",
            hayagriva::types::EntryType::Chapter => "incollection",
            hayagriva::types::EntryType::Periodical => "periodical",
            hayagriva::types::EntryType::Report => "report",
            hayagriva::types::EntryType::Thesis => "thesis",
            hayagriva::types::EntryType::Unpublished => "unpublished",
            hayagriva::types::EntryType::Proceedings => "proceedings",
            hayagriva::types::EntryType::Miscellaneous => "misc",
            _ => "misc", // Default for any other types
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
        if let Some(authors) = entry.author() {
            let author_str = authors
                .iter()
                .map(|person| {
                    if let Some(last) = person.last_name() {
                        if let Some(first) = person.first_name() {
                            format!("{}, {}", last, first)
                        } else {
                            last.to_string()
                        }
                    } else {
                        person.to_string()
                    }
                })
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
            output.push_str(&format!(",\n  publisher = {{{}}}",
                escape_latex(publisher.to_string())
            ));
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
        if entry.entry_type == hayagriva::types::EntryType::Article {
            if let Some(parent) = entry.parent(0) {
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