# Hayagriva Manager

The current Hayagriva CLI only supports Bib(La)TeX to Hayagriva YAML conversion but it doesn't support the reverse conversion.
So this project will solve that problem.

This should work as a basis to be implemented in the Hayagriva CLI.

It should only take as input a `.bib` file and output on console the YAML conversion.

## Notes

Given that BibLaTeX has many fields, and some of these being aliases of others, the conversion can't be fully perfect unless added conditionals based on the entry type and fields, following the rules from the BibLaTeX specification.
So, initially, or at least as a starting point, the conversion will be done simply, without any conditionals, thus not being perfect 1:1 conversion.
