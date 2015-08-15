NavItem = React.createClass({
	render() {
		let isActive = FlowRouter.current().path === this.props.href ? ' active' : ''
		return (<li className={this.props.className + isActive}>
					<a href={this.props.href}>{this.props.text}</a>
		</li>);
	}
});

Header = React.createClass({
	mixins: [ReactMeteorData],

	getMeteorData() {
		return {
		 	currentUser: Meteor.user()
		 }
	},

	iconSpans() {
		return _.map([1,2,3], (num) => {
			return <span key={num.toString()} className="icon-bar"></span>
		})
	},

	componentDidMount() {
		var elt = $("#loginButtons")[0]
		Blaze.render(Template._loginButtons, elt)
	},

	render() {
  	    return <nav className="navbar navbar-default" role="navigation">
		    <div className="navbar-header">
		      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navigation">
		        <span className="sr-only">Toggle navigation</span>
		       	{this.iconSpans()} 
		      </button>
		      <a className="navbar-brand" href="/">Microscope</a>
		    </div>

		    <div className="collapse navbar-collapse" id="navigation">
		      <ul className="nav navbar-nav">
		      	<NavItem active={true} text="New" key="new" href="/new" />
		      	<NavItem text="Best" key="best" href="/best" />
		      	{this.data.currentUser ? <NavItem key="submit" text="Submit Post" href="/submit" /> : ''}
		      	{this.data.currentUser ? <NotificationsView key="notifications" /> : ''}
		      </ul>
		      <ul id="loginButtons" className="nav navbar-nav navbar-right">
		      </ul>
		    </div>
		 </nav>
		}
})
