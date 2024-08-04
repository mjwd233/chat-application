import React from 'react';
import styles from '../FriendPage.module.css';

const FriendPage = () => {
  return (
    <div className={styles.friendPage}>
      <div className={styles.friendHeader}>
        <div className={styles.image} />
        <h2>Friend Name</h2>
        <p>
          { /* Online status */ }
          <span className={styles.onlineStatus}>Online</span>
          { /* or */ }
          <span className={styles.offlineStatus}>Offline</span>
          { /* or */ }
          <span className={styles.idleStatus}>Idle (last seen 30 minutes ago)</span>
        </p>
      </div>
      <div className={styles.friendInfo}>
        <p>Friend Bio</p>
        <ul>
          <li><span>Common Interests:</span> Music, Movies, Gaming</li>
          <li><span>Location:</span> New York, USA</li>
          <li><span>Joined:</span> 2 years ago</li>
        </ul>
      </div>
      <div className={styles.friendActions}>
        <button>Send Message</button>
        <button>View Profile</button>
        <button>Unfriend</button>
      </div>
      <div className={styles.friendPosts}>
        <h3>Recent Posts</h3>
        <ul>
          <li>
            <img src="post-image.jpg" alt="Post Image" />
            <p>Post Text</p>
            <span>1 hour ago</span>
          </li>
          <li>
            <img src="post-image.jpg" alt="Post Image" />
            <p>Post Text</p>
            <span>2 hours ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FriendPage;