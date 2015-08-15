RootView = React.createClass({
	render() {
		return <div>
			<div className="container">
				<Header />
				<ErrorsView />	
				<div id="main" ref="main">
					 {this.props.mainComponent}	
				</div>
			</div>
		</div>
	}
})
