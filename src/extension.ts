import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('aiblogformatter.format', () => {
		const textEditor = vscode.window.activeTextEditor;

		if(! textEditor ) {
			vscode.window.showInformationMessage('No file open');
			return;
		}

		var m;
		let fullText = textEditor.document.getText();
		const regex = /\[[a-z0-9-]{36}\] PACKER ERR .*\n/g;

		let textReplace = fullText.replace( regex, '' );

		let invalidRange = new vscode.Range(0, 0, textEditor.document.lineCount, 0);

		let validFullRange = textEditor.document.validateRange(invalidRange);

		while ((m = regex.exec(fullText)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regex.lastIndex) {
			  regex.lastIndex++;
			}
		  
			textEditor.edit(editBuilder => {
			  editBuilder.replace(validFullRange, textReplace);
			});
		  }
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
