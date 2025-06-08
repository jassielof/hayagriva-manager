import * as yaml from 'js-yaml';
import * as toml from '@ltd/j-toml';

export function parseFile(file: File): Promise<Record<string, any>> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const text = reader.result as string;
				let data;
				if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
					data = yaml.load(text);
				} else if (file.name.endsWith('.json')) {
					data = JSON.parse(text);
				} else if (file.name.endsWith('.toml')) {
					data = toml.parse(text, 1.0, '\n');
				} else {
					throw new Error('Unsupported file type');
				}
				resolve(data as Record<string, any>);
			} catch (e) {
				reject(e);
			}
		};
		reader.readAsText(file);
	});
}

export function exportYaml(data: Record<string, any>): Blob {
	return new Blob([yaml.dump(data)], { type: 'text/yaml' });
}

export function exportJson(data: Record<string, any>): Blob {
	return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
}

export function exportToml(data: Record<string, any>): Blob {
	return new Blob([toml.stringify(data)], { type: 'application/toml' });
}
