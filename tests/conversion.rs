use hayagriva::Library;
use hayagriva_manager::export_to_biblatex;
use std::collections::BTreeSet;
use std::fs;
use std::path::Path;

fn get_stem(path: &Path) -> String {
    path.file_stem().unwrap().to_string_lossy().to_string()
}

fn print_first_mismatch(original: &Library, converted: &Library, file: &str) {
    let original_keys: BTreeSet<_> = original.keys().collect();
    let converted_keys: BTreeSet<_> = converted.keys().collect();

    // Check for missing entries in conversion
    for key in original_keys.difference(&converted_keys) {
        eprintln!("CONVERSION FAILURE in {file}:");
        eprintln!("  Entry '{key}' lost during hayagriva → BibTeX → hayagriva conversion");
        return;
    }

    // Check for extra entries in conversion
    for key in converted_keys.difference(&original_keys) {
        eprintln!("CONVERSION FAILURE in {file}:");
        eprintln!("  Extra entry '{key}' appeared during hayagriva → BibTeX → hayagriva conversion");
        return;
    }

    // Check for content differences
    for key in original_keys.intersection(&converted_keys) {
        let original_entry = original.get(*key).unwrap();
        let converted_entry = converted.get(*key).unwrap();

        if original_entry != converted_entry {
            eprintln!("CONVERSION FAILURE in {file}:");
            eprintln!("  Entry '{key}' corrupted during hayagriva → BibTeX → hayagriva roundtrip");

            // Show first differing field
            macro_rules! check_field {
                ($field:ident) => {
                    if original_entry.$field() != converted_entry.$field() {
                        eprintln!("    Field '{}' mismatch:", stringify!($field));
                        eprintln!("      Original:  {:?}", original_entry.$field());
                        eprintln!("      After roundtrip: {:?}", converted_entry.$field());
                        return;
                    }
                };
            }

            check_field!(entry_type);
            check_field!(title);
            check_field!(authors);
            check_field!(date);
            check_field!(editors);
            check_field!(publisher);
            check_field!(location);
            check_field!(organization);
            check_field!(issue);
            check_field!(volume);
            check_field!(edition);
            check_field!(page_range);
            check_field!(url);
            check_field!(doi);
            check_field!(language);
            check_field!(note);

            eprintln!("    (Field difference not detected by specific checks)");
            return;
        }
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

        // Generate BibTeX from YAML using our implementation
        if !bib_path.exists() {
            let yaml_content = fs::read_to_string(&yaml_path).unwrap();
            let yaml_lib: Library = serde_yaml::from_str(&yaml_content).unwrap();
            let bib_content = export_to_biblatex(&yaml_lib).unwrap();
            fs::write(&bib_path, bib_content).unwrap();
        }

        let yaml_content = fs::read_to_string(&yaml_path).unwrap();
        let bib_content = fs::read_to_string(&bib_path).unwrap();

        let original_lib: Library = serde_yaml::from_str(&yaml_content).unwrap();
        // Convert back using official implementation to test roundtrip fidelity
        let roundtrip_lib = hayagriva::io::from_biblatex_str(&bib_content).unwrap();

        if original_lib != roundtrip_lib {
            print_first_mismatch(&original_lib, &roundtrip_lib, &stem);
            panic!("Roundtrip conversion test failed for {stem}: hayagriva → BibTeX → hayagriva produced different result");
        }
    }
}
