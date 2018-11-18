import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

// functions
import Device from '../../../common/device';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isMember } from '../../../store/reducers/user';
import { viewPostsById } from '../../../store/actions/posts';

// components
import HTMLText from '../../html-text';
import CommentList from '../../comment/list';
import Editor from '../../editor-comment';
import Follow from '../../follow';
import Like from '../../like';
// import EditButton from '../../edit-button';
import ReportMenu from '../../report-menu';
// import Bundle from '../../bundle';
import Share from '../../share';


// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@withRouter
@connect(
  (state, props) => ({
    isMember: isMember(state)
  }),
  dispatch => ({
    viewPostsById: bindActionCreators(viewPostsById, dispatch)
  })
)
@CSSModules(styles)
export default class PostsItem extends React.PureComponent {

  static propTypes = {
    // 帖子对象
    posts: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    const { posts } = this.props;
    this.state = {
      expandContent: posts.expandContent || false,
      expandComment: posts.expandComment || false
    }
    this.expandContent = this.expandContent.bind(this);
    this.expandComment = this.expandComment.bind(this);
    this.collapseContent = this.collapseContent.bind(this);
    this.updateFooter = this.updateFooter.bind(this);
  }

  componentDidMount() {
    if (this.state.expandContent) {
      const self = this;
      $(window).scroll(this.updateFooter);
      self.updateFooter();
    }
  }

  componentWillUnmount() {
    if (this.state.expandContent) {
      $(window).unbind('scroll', this.updateFooter);
    }
  }

  componentDidCatch(error, info) {

    console.log(error);
    console.log(info);

    // Display fallback UI
    // this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  // 更新
  updateFooter() {

    if (!this.state.expandContent) return;

    const { posts } = this.props;

    let y = $('#'+posts._id).offset().top,
        height = $('#'+posts._id).height();

    let scrollY = $(window).scrollTop() + $(window).height();

    if (scrollY > y + 90 && scrollY < y + height) {
      $('#'+posts._id+'-footer').addClass('fixed');
    } else {
      $('#'+posts._id+'-footer').removeClass('fixed');
    }

  }

  expandContent() {

    const { posts } = this.props;

    $('#posts-modal').modal({
      show: true
    }, {
      postsId: posts._id
    });

    /*
    return;

    const self = this;
    const { posts, viewPostsById } = this.props;

    // 如果移动设备，打开详情页面
    if (Device.isMobileDevice()) {
      this.props.history.push(`/posts/${posts._id}`)
      return
    }

    viewPostsById({ id: posts._id });

    this.setState({
      expandContent: true,
      expandComment: true
    });
    posts.expandContent = true;
    posts.expandComment = true;

    this.updateFooter();

    $(window).scroll(this.updateFooter);
    */
  }

  collapseContent() {
    const { posts } = this.props;
    this.setState({
      expandContent: false,
      expandComment: false
    });
    posts.expandContent = false;
    posts.expandComment = false;

    this.updateFooter();

    $(window).unbind('scroll', this.updateFooter);
  }

  expandComment(e) {

    e.stopPropagation();

    const { posts } = this.props;
    this.setState({
      expandComment: this.state.expandComment ? false : true
    });
    posts.expandComment = this.state.expandComment ? false : true;
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  render () {

    const { posts, isMember } = this.props;
    const { expandContent, expandComment } = this.state;


    // console.log(posts);

    // console.log(posts.images);

    /**
    onClick={()=>{
      // $('#sign').show('')
      $('#posts').modal({
        show: true
      }, {
        postsId:posts._id
      });
    }}
    */

    let coverImage = '';


    if (posts.content_summary && posts.content_summary.length > 100 && posts.coverImage) {
      coverImage = posts.coverImage;
    }

    return (<div id={posts._id} styleName={"item"} onClick={this.expandContent}>

      <div styleName="head">
        {typeof posts.user_id == 'object' ?
          <div styleName="info">

            <Link to={`/people/${posts.user_id._id}`} onClick={this.stopPropagation}>
              <i
                styleName="avatar"
                className="load-demand"
                data-load-demand={`<img src="${posts.user_id.avatar_url}" />`}>
                </i>
              <b>{posts.user_id.nickname}</b>
              {/*<span styleName="people-brief">{posts.user_id.brief}</span>*/}
            </Link>

            {/* dropdown-menu */}

            {/* dropdown-menu end */}

            <div>
              <span><Link to={`/topic/${posts.topic_id._id}`} onClick={this.stopPropagation}>{posts.topic_id.name}</Link></span>
              {posts.view_count ? <span>{posts.view_count}次浏览</span> : null}
              {posts.like_count ? <span>{posts.like_count} 个赞</span> : null}
              {posts.follow_count ? <span>{posts.follow_count}人关注</span> : null}
              {/*posts.comment_count ? <span>{posts.comment_count}评论</span> : null*/}
              <span>{posts._create_at}</span>
            </div>

          </div>
          : null}


            {/*<ReportMenu posts={posts} />*/}

            {(()=>{

              // console.log(posts);

              if (posts.comment_count == 0) {
                return;
              }

              // let images = [];
              //
              // posts.comment.map(item=>{
              //   if (images.indexOf(item.user_id.avatar_url) == -1 && item.user_id._id != posts.user_id._id) {
              //     images.push(item.user_id.avatar_url);
              //   }
              // });


              return (<div styleName="comment-people-list">

                        {/*images.map((item, index)=>{
                          return (<span key={item} style={{zIndex:10-index}}>
                            <img src={item} />
                          </span>)
                        })*/}

                        <span><div styleName="comment-count">{posts.comment_count}</div></span>

                      </div>)

            })()}


      </div>

      <div styleName="title">
        <Link to={`/posts/${posts._id}`} onClick={this.stopPropagation}>{posts.title}</Link>
      </div>

      {posts.content_summary ?
        <div styleName="content">
          <div>
            {posts.content_summary}
          </div>
          {posts.images && posts.images.length > 0 ?
            <div styleName="images">
              {posts.images.map((item, index)=>{
                if (index > 9) return;
                return <span key={item} styleName="image-item" style={{backgroundImage:`url(${item})`}}></span>
              })}
            </div>
            : null}
        </div>
      : null}

      {/*expandContent ?
        <div styleName="content">
          <HTMLText content={posts.content_html} hiddenHalf={!isMember && posts.recommend ? true : false} />
        </div> : (posts.content_summary ?
          <div styleName="content">
            <div styleName={coverImage ? 'cover' : null}>
              {coverImage ? <div styleName="cover-image" style={{backgroundImage:`url(${coverImage})`}}></div> : null}
              {posts.content_summary}
            </div>
          </div>
        : null)*/}

        {/*
        <div styleName="footer">
          <div id={posts._id+'-footer'}>


            <div styleName="footer-main">

                <div styleName="actions">
                  <Like posts={posts} />
                  <a href="javascript:void(0)">
                    {posts.comment_count ? posts.comment_count + ' 条评论' : '评论'}
                  </a>
                  <Follow posts={posts} />
                  <Share posts={posts} />
                  <EditButton posts={posts} />
                </div>

            </div>

          </div>
        </div>
        */}

      {/*expandComment ?
        <div onClick={this.stopPropagation}>

            <CommentList
              name={posts._id}
              filters={{
                variables: {
                  posts_id: posts._id,
                  parent_id: 'not-exists',
                  page_size: 10,
                  deleted: false,
                  weaken: false
                }
              }}
              />

            {isMember ?
              <div className="border-top">
                <Editor posts_id={posts._id} />
              </div>
              : null}

        </div>
        : null*/}

    </div>)

  }

}
