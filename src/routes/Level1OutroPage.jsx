const Level1OutroPage = () => {
	const pages = import.meta.glob('./routes/*Page.jsx');
	console.log('🤞', pages);
	return (
		<div>
			<h1>You've completed Level 1!</h1>
		</div>
	);
};

export default Level1OutroPage;