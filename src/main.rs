use anyhow::{Context, Result};
use clap::{Parser, ValueEnum};
use hayagriva::Library;

use std::fs;
use std::io::{self, Write};
use std::path::PathBuf;

use hayagriva_manager::export_to_biblatex;

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
        InputFormat::Yaml => {
            serde_yaml::from_str::<Library>(&content).context("Failed to parse YAML input")?
        }
        InputFormat::Json => {
            serde_json::from_str::<Library>(&content).context("Failed to parse JSON input")?
        }
        InputFormat::Toml => {
            toml::from_str::<Library>(&content).context("Failed to parse TOML input")?
        }
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
