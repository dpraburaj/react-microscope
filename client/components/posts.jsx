PostItem = React.createClass({
	ownPost() {
		return this.props.post.userId == Meteor.userId();
	},

	domain() {
		var a = document.createElement('a');
		a.href = this.props.post.url;
		return a.hostname;
	},

	upvotedClass() {
		var userId = Meteor.userId();
		if (userId && !_.include(this.props.post.upvoters, userId)) {
			return 'btn-primary upvotable';
		} else {
			return 'disabled';
		}
	},

	onUpvote(e) {
		if(this.upvotedClass().indexOf('upvotable') > -1)
			Meteor.call('upvote', this.props.post._id);
	},

	pluralize(n, thing) {
		if (n === 1) {
			return '1 ' + thing;
		} else {
			return n + ' ' + thing + 's';
		}
	},

	votesCount() {
		return this.pluralize(this.props.post.votes, 'Vote')
	},

	commentsCount() {
		return this.pluralize(this.props.post.commentsCount, 'Comment')
	},

	editButton() {
		return this.ownPost() ? <a href={FlowRouter.path('postEdit', this.props.post)}>Edit</a> : ''
	},

	render() {
		let upvoteButtonClasses = "upvote btn btn-default " + this.upvotedClass()
		let postPagePath = FlowRouter.path('postPage', this.props.post)
		return ( 
		  <div className="post">
		    <a className={upvoteButtonClasses} onClick={this.onUpvote}>⬆</a>
		    <div className="post-content">
		      <h3>
			      <a href={this.props.post.url}>{this.props.post.title}</a>
			      <span>{this.domain()}</span>
		      </h3>
		      <p>
		       {this.votesCount()} submitted by {this.props.post.author}, &nbsp;
		        <a href={postPagePath}>{this.commentsCount()}</a>
		        
		        &nbsp; {this.editButton()}
		      </p>
		    </div>
		    <a href={postPagePath} className="discuss btn btn-default">Discuss</a>
		  </div>
	  )
	}	
})

PostForm = React.createClass({
	mixins: [React.addons.LinkedStateMixin],	

	componentWillReceiveProps(nextProps) {
		let post = nextProps.post
		this.setState({ url: post.url, title: post.title })
	},

	getInitialState() {
		if(this.props.post)
			return { url: this.props.post.url, title: this.props.post.title, postSubmitErrors: {}}
		return { url: '', title: '', postSubmitErrors: {}}
	},

	onDelete(e) {
		e.preventDefault();

		if (confirm("Delete this post?")) {
			var currentPostId = this.props.postId;
			Posts.remove(currentPostId);
			FlowRouter.go('home');
		}
	},

	submit(e) {
		e.stopPropagation();
		e.preventDefault();

		let postProperties = {
			url: this.state.url,
			title: this.state.title
		}

		let errors = validatePost(postProperties);
		if (errors.title || errors.url)
			return this.setState({postSubmitErrors: errors});

		if(this.props.action === 'edit') {
			Posts.update(this.props.post._id, {$set: postProperties}, (error) => {
				if (error) {
					throwError(error.reason);
				} else {
					FlowRouter.go('postPage', {_id: this.props.post._id});
				}
			});
		}

		else {
			Meteor.call('postInsert', postProperties, (err, result) => {
				if (err)
					return throwError(err.reason);

		    //show this result but route anyway
		    if (result.postExists)
		    	throwError('This link has already been posted');

		    FlowRouter.go('postPage', {_id: result._id});  
		})
		}
	},

	onInputChange(e) {
		this.setState({title: e.target.value })
	},

	deletePostButton() {
		if(this.props.action === 'edit')
			return <a className="btn btn-danger delete" onClick={this.onDelete}>Delete post</a>
	},

	errorMessage(field) {
		return this.state.postSubmitErrors[field];
	},

	errorClass(field) {
		return !!this.state.postSubmitErrors[field] ? 'has-error' : '';
	},

	render() {
		return (
		  <form className="main form page" onSubmit={this.submit}>
		    <div className={"form-group " + this.errorClass('url')}>
		      <label className="control-label" htmlFor="url">URL</label>
		      <div className="controls">
		          <input id="url" type="text" ref='url' valueLink={this.linkState('url')}
				          placeholder="Your URL" className="form-control" />
		          <span className="help-block">{this.errorMessage('url')}</span>
		      </div>
		    </div>
		    <div className={"form-group " + this.errorClass('title')}>
		      <label className="control-label" htmlFor="title">Title</label>
		      <div className="controls">
		          <input id="title" type="text" valueLink={this.linkState('title')} 
			          placeholder="Name your post" className="form-control" />
		          <span className="help-block">{this.errorMessage('title')}</span>
		      </div>
		    </div>
		    <input type="submit" value="Submit" className="btn btn-primary submit"/>
		    <hr/>
		    {this.deletePostButton()}
		  </form>
		)
	}
})

NewPost = React.createClass({
	render() {
		return <PostForm action='new'/>	
	}
})

EditPost = React.createClass({
	mixins: [ReactMeteorData],	

	getMeteorData() {
		Meteor.subscribe('singlePost', this.props.postId)
		return { 
			post: Posts.findOne(this.props.postId) 
		}
	},

	render() {
		return <PostForm action='edit' post={this.data.post} />	
	}
})

PostPage = React.createClass({
	mixins: [ReactMeteorData],

	getMeteorData() {
		Meteor.subscribe('singlePost', this.props.postId)
		Meteor.subscribe('comments', this.props.postId)
		return {
			post: Posts.findOne(this.props.postId),
			comments: Comments.find({postId: this.props.postId }).fetch() 
		}
	},

	render() {
		let commentItems = this.data.comments.map((c) => {
			return <CommentItem key={c._id} comment={c} />
		})

		let submitForm  
		if(Meteor.user())
			submitForm = <CommentSubmit post={this.data.post} />
		else
			submitForm = <p> Please log in to leave a comment </p> 

		return (
			<div className="post-page page">
				<PostItem post={this.data.post || {}} /> 

				<ul className="comments">
					{commentItems}
				</ul>

				{submitForm}
			</div>
		)
	}
}) 

PostsList = React.createClass({
	mixins: [ReactMeteorData],

	getInitialState() {
		return { postLimit: parseInt(this.props.limit) || this.increment() }
	},

	getMeteorData() {
		let modifier = {} 
		if(this.props.filter === 'new') 
			_.extend(modifier, { submitted: -1, _id: -1 })
		else 
			_.extend(modifier, { votes: -1, submitted: -1, _id: -1 })

		let sub = Meteor.subscribe('posts', {sort: modifier, limit: this.state.postLimit })
		return {
			posts: Posts.find({}, {sort: modifier}).fetch()	
		}
	},

	increment() {
		return 5
	},

	postsCount() {
		return Posts.find().count()
	},

	componentWillReceiveProps(nextProps) {
		if(nextProps.filter !== this.props.filter)
			this.setState({postLimit: nextProps.limit})
	},

	postItems() {
		return _.map(this.data.posts, (post) => { 
			return <PostItem post={post} key={post._id}/>; 
		});
	},

	loadMore() {
		if(Posts.find({}, {limit: this.postLimit }).count() === this.state.postLimit) {
			return <a onClick={this.onLoadMore} 
					  className="load-more">Load more</a>
		}
	},

	onLoadMore() {
		this.setState({postLimit: this.state.postLimit + this.increment() })
	},

	render() {
	 return <div className="posts page">
	    <div className="wrapper">
			{this.postItems()}
	    </div>
	    {this.loadMore()}
	  </div>
	}
})
