import React from 'react';
import { Link } from 'react-router-dom';

// components
import Follow from '@components/follow';

import './index.scss';

interface Props {
  topic: Topic
}

type Topic = {
  parent_id: any,
  name: string,
  avatar: string,
  brief: string,
  posts_count: number,
  follow_count: number,
  comment_count: number,
  follow: boolean
}

export default function({ topic }:Props) {
  return (
    <div styleName="container">
    <div styleName="item" style={{ backgroundImage:`url(${topic.avatar})` }}></div>
    <div styleName="main">
      <img styleName="avatar" src={topic.avatar} className="align-self-start rounded" width="80" height="80" alt={topic.name} />
      <div className="d-flex justify-content-between">
        <div>
          {topic.parent_id ?
            <>
              <Link to={`/topic/${topic.parent_id._id}`} className="text-primary">{topic.parent_id.name}</Link>
              <span className="ml-1 mr-1">›</span>
            </>
            : null}
          {topic ? topic.name : null}
          <div styleName="brief">{topic.brief}</div>
          {topic.posts_count ? <span className="mr-3" styleName="brief">{topic.posts_count} 帖子</span> : null}
          {topic.follow_count ? <span className="mr-3" styleName="brief">{topic.follow_count} 人关注</span> : null}
          {topic.comment_count ? <span className="mr-3" styleName="brief">{topic.comment_count} 条评论</span> : null}
        </div>
        <div>
          {topic.parent_id ?
            <div style={{float:'right'}}><Follow topic={topic} /></div>
            : null}
        </div>
      </div>
    </div>
    </div>
  )
}