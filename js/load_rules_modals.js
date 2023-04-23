$(() => {
	const div = document.createElement('div');
	div.id = 'rules-modals-placeholder';
	$('body').append(div);
	$('#rules-modals-placeholder').load('../html/chunks/rules_modals.html');
});
