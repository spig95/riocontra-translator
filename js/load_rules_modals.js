$(() => {
	const div = document.createElement('div');
	div.id = 'rules-modals-placeholder';
	$('body').append(div);
	$('#rules-modals-placeholder').load('/riocontra-translator/html/chunks/rules_modals.html');
});
