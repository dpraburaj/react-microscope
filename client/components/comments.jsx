CommentItem = React.createClass({
	submittedText () {
	    return this.props.comment.submitted.toString();
	},

	render() {
		return (
		  <li>
		    <h4>
		      <span className="author">{this.props.comment.author}</span>
		      <span className="date"> on {this.submittedText()}</span>
		    </h4>
		    <p>{this.props.comment.body}</p>
		  </li>
	  )
	}
})

CommentSubmit = React.createClass({
	mixins: [React.addons.LinkedStateMixin],	

	getInitialState() {
		return { body: '', commentSubmitErrors: {} }
	},

	errorMessage (field) {
		return this.state.commentSubmitErrors[field];
	},

	errorClass(field) {
		return !!this.state.commentSubmitErrors[field] ? 'has-error' : '';
	},

	onSubmit(e) {
		e.preventDefault();

		var comment = {
			body: this.state.body,
			postId: this.props.post._id
		};

		var errors = {};
		if (!comment.body) {
			errors.body = "Please write some content";
			return this.setState({commentSubmitErrors: errors});
		}
    
		Meteor.call('commentInsert', comment, (error, commentId) => {
			if (error){
				throwError(error.reason);
			} else {
				this.setState({body: '', commentSubmitErrors: {}})
			}
		});
	},

	render() {
		return (
			  <form name="comment" className="comment-form form" onSubmit={this.onSubmit}>
			    <div className={"form-group " + this.errorClass('body')}>
			        <div className="controls">
			            <label htmlFor="body">Comment on this post</label>
			            <textarea name="body" valueLink={this.linkState('body')} 
				            id="body" className="form-control" rows="3"></textarea>
			            <span className="help-block">{this.errorMessage('body')}</span>
			        </div>
			    </div>
			    <button type="submit" className="btn btn-primary">Add Comment</button>
			  </form>
	  )
	}
})