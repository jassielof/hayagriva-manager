use hayagriva::Library;
use std::fs;
use std::path::Path;

// Import your conversion function
use hayagriva_manager::export_to_biblatex;

fn get_stem(path: &Path) -> String {
    path.file_stem().unwrap().to_string_lossy().to_string()
}

#[test]
fn test_bib_to_yaml_conversion() {
    let bib_dir = Path::new("data/bib");
    let from_bib_dir = Path::new("data/from_bib");

    for entry in fs::read_dir(bib_dir).unwrap() {
        let entry = entry.unwrap();
        let bib_path = entry.path();
        if bib_path.extension().and_then(|s| s.to_str()) != Some("bib") {
            continue;
        }
        let stem = get_stem(&bib_path);
        let yaml_path = from_bib_dir.join(format!("{stem}.yml"));

        // If missing, generate using your conversion logic
        if !yaml_path.exists() {
            let bib_content = fs::read_to_string(&bib_path).unwrap();
            let bib_lib = hayagriva::io::from_biblatex_str(&bib_content).unwrap();
            let yaml_content = serde_yaml::to_string(&bib_lib).unwrap();
            fs::write(&yaml_path, yaml_content).unwrap();
        }

        let bib_content = fs::read_to_string(&bib_path).unwrap();
        let yaml_content = fs::read_to_string(&yaml_path).unwrap();

        let bib_lib = hayagriva::io::from_biblatex_str(&bib_content).unwrap();
        let yaml_lib: Library = serde_yaml::from_str(&yaml_content).unwrap();

        assert_eq!(bib_lib, yaml_lib, "Mismatch for {stem}");
    }
}

#[test]
fn test_yaml_to_bib_conversion() {
    let yaml_dir = Path::new("data/hayagriva");
    let from_yaml_dir = Path::new("data/from_hayagriva");

    for entry in fs::read_dir(yaml_dir).unwrap() {
        let entry = entry.unwrap();
        let yaml_path = entry.path();
        if yaml_path.extension().and_then(|s| s.to_str()) != Some("yaml") {
            continue;
        }
        let stem = get_stem(&yaml_path);
        let bib_path = from_yaml_dir.join(format!("{stem}.bib"));

        // If missing, generate using your conversion logic
        if !bib_path.exists() {
            let yaml_content = fs::read_to_string(&yaml_path).unwrap();
            let yaml_lib: Library = serde_yaml::from_str(&yaml_content).unwrap();
            let bib_content = export_to_biblatex(&yaml_lib).unwrap();
            fs::write(&bib_path, bib_content).unwrap();
        }

        let yaml_content = fs::read_to_string(&yaml_path).unwrap();
        let bib_content = fs::read_to_string(&bib_path).unwrap();

        let yaml_lib: Library = serde_yaml::from_str(&yaml_content).unwrap();
        let bib_lib = hayagriva::io::from_biblatex_str(&bib_content).unwrap();

        assert_eq!(yaml_lib, bib_lib, "Mismatch for {stem}");
    }
}
