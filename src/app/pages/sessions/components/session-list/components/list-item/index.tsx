import React from 'react';
import { Link } from 'react-router-dom';

// style
import './styles/index.scss';

interface Props {
  key?: any
  message: any
}

export default function({ message }: Props) {
  return (<div>
    <Link to={`/session/${message._id}`} styleName="item">

      <div className="d-flex bd-highlight">

        <div className="w-100 bd-highlight">
          <div styleName="main">
            {message.unread_count ? <div styleName="unread">{message.unread_count}</div> : null}
            <div styleName="avatar">
              <img src={message.user_id.avatar_url} />
            </div>
            <div styleName="nickname" className="text-dark">
              {message.user_id.nickname}
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-1 bd-highlight">
          <div styleName="create-at">{message.last_message ? message.last_message._create_at : message._create_at}</div>
        </div>

      </div>

      {message.last_message ?
        <div styleName="content" className="text-secondary">{message.last_message.content_summary}</div>
        : null}

    </Link>
    <div styleName="line" className="border-bottom"></div>
    </div>
  )
}