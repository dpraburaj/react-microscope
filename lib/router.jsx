setMain = (c) => {
	ReactLayout.render(RootView, {
		mainComponent: c
	})	
}

FlowRouter.route('/', {
  name: 'home',
  action: (params) => {
    setMain(<PostsList filter='new' limit={5} />)
  }
});

FlowRouter.route('/new', {
	action: (params) => {
		setMain(<PostsList filter='new' limit={5} />)
	}
});

FlowRouter.route('/best', {
	action: (params) => {
		setMain(<PostsList filter='best' limit={5} />)
	}
});

FlowRouter.route('/submit', {
  action: (params) => {
    setMain(<NewPost />)
  }
});

FlowRouter.route('/posts/:_id', {
	name: 'postPage',
	action: (params) => {
		setMain(<PostPage postId={params._id}/>)
	}
})

FlowRouter.route('/posts/:_id/edit', {
	name: 'postEdit',
	action: (params) => {
		setMain(<EditPost postId={params._id} />)
	}
});