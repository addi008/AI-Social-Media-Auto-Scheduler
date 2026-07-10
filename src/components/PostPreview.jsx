import React from 'react';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Bookmark, 
  Share, 
  MoreHorizontal, 
  Globe, 
  ThumbsUp, 
  Send,
  MessageSquare
} from 'lucide-react';

const PostPreview = ({ content = '', mediaUrl = '', platform = 'twitter', profile = {} }) => {
  const defaultProfile = {
    name: 'Aether Brand',
    handle: '@aether_scheduler',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80'
  };

  const currentProfile = { ...defaultProfile, ...profile };
  const textContent = content || 'Write or generate something amazing...';

  // Format content with clickable hashtags
  const formatContent = (text) => {
    return text.split(/(\s+)/).map((part, index) => {
      if (part.startsWith('#')) {
        return <span key={index} className="preview-hashtag">{part}</span>;
      }
      if (part.startsWith('@')) {
        return <span key={index} className="preview-mention">{part}</span>;
      }
      return part;
    });
  };

  // Render Twitter/X Mockup
  const renderTwitter = () => {
    return (
      <div className="platform-card twitter-preview">
        <div className="preview-header">
          <img src={currentProfile.avatar} alt="avatar" className="preview-avatar" />
          <div className="user-details">
            <span className="user-name">{currentProfile.name}</span>
            <span className="user-handle">{currentProfile.handle}</span>
            <span className="meta-dot">•</span>
            <span className="post-time">1m</span>
          </div>
          <MoreHorizontal size={16} className="header-more" />
        </div>
        
        <div className="preview-body">
          <p className="post-text">{formatContent(textContent)}</p>
          {mediaUrl && (
            <div className="preview-media-container">
              <img src={mediaUrl} alt="Post media" className="preview-media" />
            </div>
          )}
        </div>

        <div className="preview-actions twitter-actions">
          <button className="preview-action-btn"><MessageCircle size={15} /> <span>2</span></button>
          <button className="preview-action-btn"><Repeat2 size={15} /> <span>5</span></button>
          <button className="preview-action-btn"><Heart size={15} /> <span>12</span></button>
          <button className="preview-action-btn"><Bookmark size={15} /> <span>1</span></button>
          <button className="preview-action-btn"><Share size={15} /></button>
        </div>
      </div>
    );
  };

  // Render LinkedIn Mockup
  const renderLinkedIn = () => {
    return (
      <div className="platform-card linkedin-preview">
        <div className="preview-header">
          <img src={currentProfile.avatar} alt="avatar" className="preview-avatar" />
          <div className="user-details-stacked">
            <div className="user-row">
              <span className="user-name">{currentProfile.name}</span>
              <span className="meta-dot-small">•</span>
              <span className="connection-degree">1st</span>
            </div>
            <span className="user-title">Design Engineer & Solopreneur</span>
            <span className="post-time flex-center">1m • <Globe size={11} style={{ marginLeft: 3 }} /></span>
          </div>
          <MoreHorizontal size={18} className="header-more" />
        </div>

        <div className="preview-body">
          <p className="post-text">{formatContent(textContent)}</p>
          {mediaUrl && (
            <div className="preview-media-container-linkedin">
              <img src={mediaUrl} alt="Post media" className="preview-media-linkedin" />
            </div>
          )}
        </div>

        <div className="preview-actions-linkedin">
          <button className="linkedin-action-btn"><ThumbsUp size={16} /> <span>Like</span></button>
          <button className="linkedin-action-btn"><MessageSquare size={16} /> <span>Comment</span></button>
          <button className="linkedin-action-btn"><Repeat2 size={16} /> <span>Repost</span></button>
          <button className="linkedin-action-btn"><Send size={16} /> <span>Send</span></button>
        </div>
      </div>
    );
  };

  // Render Instagram Mockup
  const renderInstagram = () => {
    return (
      <div className="platform-card instagram-preview">
        <div className="preview-header">
          <img src={currentProfile.avatar} alt="avatar" className="preview-avatar-circle" />
          <div className="user-details">
            <span className="user-name">{currentProfile.handle.replace('@', '')}</span>
          </div>
          <MoreHorizontal size={18} className="header-more" />
        </div>

        <div className="preview-body-instagram">
          {mediaUrl ? (
            <div className="preview-media-square">
              <img src={mediaUrl} alt="Post media" className="instagram-media" />
            </div>
          ) : (
            <div className="instagram-media-placeholder flex-center">
              <span>Attach an image to preview Instagram post</span>
            </div>
          )}
          
          <div className="preview-actions-instagram">
            <Heart size={20} className="insta-icon" />
            <MessageCircle size={20} className="insta-icon" />
            <Send size={20} className="insta-icon" />
            <Bookmark size={20} className="insta-icon-right" />
          </div>

          <div className="instagram-caption-section">
            <span className="caption-likes">Liked by 24 people</span>
            <p className="instagram-caption">
              <span className="caption-username">{currentProfile.handle.replace('@', '')}</span>{' '}
              {formatContent(textContent)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render Facebook Mockup
  const renderFacebook = () => {
    return (
      <div className="platform-card facebook-preview">
        <div className="preview-header">
          <img src={currentProfile.avatar} alt="avatar" className="preview-avatar" />
          <div className="user-details-stacked">
            <span className="user-name">{currentProfile.name}</span>
            <span className="post-time flex-center">1 min • <Globe size={11} style={{ marginLeft: 3 }} /></span>
          </div>
          <MoreHorizontal size={18} className="header-more" />
        </div>

        <div className="preview-body">
          <p className="post-text">{formatContent(textContent)}</p>
          {mediaUrl && (
            <div className="preview-media-container-facebook">
              <img src={mediaUrl} alt="Post media" className="preview-media-facebook" />
            </div>
          )}
        </div>

        <div className="preview-actions-facebook">
          <button className="fb-action-btn"><ThumbsUp size={16} /> <span>Like</span></button>
          <button className="fb-action-btn"><MessageSquare size={16} /> <span>Comment</span></button>
          <button className="fb-action-btn"><Share size={16} /> <span>Share</span></button>
        </div>
      </div>
    );
  };

  switch (platform) {
    case 'twitter':
      return renderTwitter();
    case 'linkedin':
      return renderLinkedIn();
    case 'instagram':
      return renderInstagram();
    case 'facebook':
      return renderFacebook();
    default:
      return renderTwitter();
  }
};

export default PostPreview;
