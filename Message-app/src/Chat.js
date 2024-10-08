import React, { Component, createRef } from 'react';
import moment from 'moment';
import client from './feathers';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.txtMessage = createRef();
    this.chatMain = createRef();
  }

  sendMessage = (ev) => {
    const text = this.txtMessage.current.value.trim();

    if (text) {
      client.service('messages').create({ text }).then(() => {
        this.txtMessage.current.value = '';
      });
    }

    ev.preventDefault();
  };

  scrollToBottom = () => {
    const chat = this.chatMain.current;
    if (chat) {
      chat.scrollTop = chat.scrollHeight - chat.clientHeight;
    }
  };

  componentDidMount() {
    client.service('messages').on('created', this.scrollToBottom);
    this.scrollToBottom();
  }

  componentWillUnmount() {
    // Clean up listeners
    client.service('messages').removeListener('created', this.scrollToBottom);
  }

  render() {
    const { users, messages } = this.props;

    return (
      <main className="flex flex-column">
        <header className="title-bar flex flex-row flex-center">
          <div className="title-wrapper block center-element">
            <img
              className="logo"
              src="http://feathersjs.com/img/feathers-logo-wide.png"
              alt="Feathers Logo"
            />
            <span className="title">Chat</span>
          </div>
        </header>

        <div className="flex flex-row flex-1 clear">
          <aside className="sidebar col col-3 flex flex-column flex-space-between">
            <header className="flex flex-row flex-center">
              <h4 className="font-300 text-center">
                <span className="font-600 online-count">{users.length}</span> users
              </h4>
            </header>

            <ul className="flex flex-column flex-1 list-unstyled user-list">
              {users.map(user => (
                <li key={user._id}>
                  <a className="block relative" href="#">
                    <img src={user.avatar} alt={user.email} className="avatar" />
                    <span className="absolute username">{user.email}</span>
                  </a>
                </li>
              ))}
            </ul>
            <footer className="flex flex-row flex-center">
              <a href="#" onClick={() => client.logout()} className="button button-primary">
                Sign Out
              </a>
            </footer>
          </aside>

          <div className="flex flex-column col col-9">
            <main className="chat flex flex-column flex-1 clear" ref={this.chatMain}>
              {messages.map(message => (
                <div key={message._id} className="message flex flex-row">
                  <img src={message.user.avatar} alt={message.user.email} className="avatar" />
                  <div className="message-wrapper">
                    <p className="message-header">
                      <span className="username font-600">{message.user.email}</span>
                      <span className="sent-date font-300">
                        {moment(message.createdAt).format('MMM Do, hh:mm:ss')}
                      </span>
                    </p>
                    <p className="message-content font-300">{message.text}</p>
                  </div>
                </div>
              ))}
            </main>

            <form onSubmit={this.sendMessage} className="flex flex-row flex-space-between" id="send-message">
              <input ref={this.txtMessage} type="text" name="text" className="flex flex-1" />
              <button className="button-primary" type="submit">Send</button>
            </form>
          </div>
        </div>
      </main>
    );
  }
}

export default Chat;
