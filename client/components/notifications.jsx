NotificationItem = React.createClass({

  notificationPostPath() {
		return FlowRouter.path('postPage', {_id: this.props.notification.postId});
  },

  onNotificationClicked() {
    Notifications.update(this.props.notification._id, {$set: {read: true}});
  },

  render() {
		return (
		  <li>
		    <a href={this.notificationPostPath()} onClick={this.onNotificationClicked}>
		      <strong>{this.props.notification.commenterName}</strong> 
		      <small> commented on your post </small>
		    </a>
		  </li>
		  )
	}
})

// Cannot name it Notifications, since it'll clash with the collection Notifications
NotificationsView = React.createClass({
	mixins: [ReactMeteorData],

	getMeteorData() {
		let sub = Meteor.subscribe('notifications')
		return {
			loaded: sub.ready(),
			notifications: Notifications.find({userId: Meteor.userId(), read: false}).fetch(),
			notificationsCount: Notifications.find({userId: Meteor.userId(), read: false}).count()
		}
	},
	badge() {
		if(this.data.notificationsCount)
			return <span> &nbsp; 
				<span className="badge badge-inverse">{this.data.notificationsCount}</span>
				&nbsp;
			</span>
	},
	notificationItems() {
		if(this.data.notificationsCount) {
			return _.map(this.data.notifications, (notification) => {
				return <NotificationItem key={notification._id} notification={notification} />
			})		
		}
		else {
			return <li><span>No Notifications</span></li>
		}
	},

	render() {
		return (<li className="dropdown">
			<a href="#" className="dropdown-toggle" data-toggle="dropdown">
			Notifications
				{this.badge()}
				<b className="caret"></b>
			</a>
			<ul className="notification dropdown-menu">
				{this.notificationItems()}	
			</ul>
		</li>)
	}
})