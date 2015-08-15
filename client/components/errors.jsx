ErrorsView = React.createClass({
	mixins: [ReactMeteorData],

	getMeteorData() {
		return { errors: Errors.find().fetch() }
	},

	render() {
		let errorItems = _.map(this.data.errors, (err) => {
			return <ErrorItem error={err} />	
		})	
		return <div className="errors"> {errorItems} </div>
	}	
})

ErrorItem = React.createClass({
	componentDidMount() {
		Meteor.setTimeout(function () {
			Errors.remove(this.props.error._id);
		}, 3000);
	},

	render() {
		return <div className="alert alert-danger" role="alert">
			    <button type="button" className="close" data-dismiss="alert">&times;</button>
			    {this.props.error.message}
		    </div>
	}
})
