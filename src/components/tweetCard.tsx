import { Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, Paper, Typography } from '@material-ui/core'
import React from 'react'
import { Tweet } from '../api/tweets'
import { UserAvartar } from './userAvatar'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { toDateAndMonth } from '../util/dates';
import { stringify } from 'querystring';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "0.3em 0 0.3em 0",
    display: 'flex',
    flexDirection: 'column',
  },
  avatar: {
    margin: '0 0 1em 0',
    width: '8em',
    height: '8em',
  },
}))

export type TweetCardProps = {
  tweet: Tweet,
  f?: boolean
  onFavoriteToggle: (tweetId: number) => void
  userId?: string
}
// is the actual format that the tweets take
// made up of five components
// avatar (profile picture), the user name, the time it was posted, the content and the favorited icon (likes)

export const TweetCard: React.FC<TweetCardProps> = ({ tweet, f, onFavoriteToggle, userId }) => {
  const classes = useStyles()
  const { id, author, favoritedBy, favorites, isFavorited, content, createdAt } = tweet;

  const [localLikes, setLocalLikes] = React.useState<any>(0);
  const [clicked, setClicked] = React.useState(false);

  React.useEffect(() => {
    const totalLikes = window.localStorage.getItem(`${id}`) ? JSON.parse(window.localStorage.getItem(`${id}`) as string).length : 0
    setLocalLikes(totalLikes)
  }, [clicked])




  function saveTweetLikes(tweetId: any, userId: any) {
    // Check if there is already a saved array of likes for this tweet
    let likes: any = localStorage.getItem(tweetId);

    // If there isn't, create an empty array
    if (!likes) {
      likes = [];
    } else {
      // Otherwise, parse the saved JSON string into an array
      likes = JSON.parse(likes);
    }

    const index = likes.indexOf(userId);
    if (index === -1) {
      // Add the new user ID to the array of likes
      likes.push(userId);
    } else {
      // Remove the user ID from the array of likes
      likes.splice(index, 1);
    }

    // Save the array of likes back to local storage as a JSON string
    localStorage.setItem(tweetId, JSON.stringify(likes));
  }


  return (
    <Card variant="outlined" className={classes.paper}>
      <CardHeader
        avatar={
          <UserAvartar path={author.avatar_url} name={author.username} />
        }
        title={author.username}
        subheader={toDateAndMonth(createdAt)}
      />
      <CardContent>
        {content}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="toggle favorite for this tweet" onClick={() => { if (userId) { saveTweetLikes(id, userId); setClicked(!clicked) } else { window.location.reload() } }}>
          {
            window.localStorage.getItem(`${id}`)?.includes(userId as string) ?
              <FavoriteIcon /> :
              <FavoriteBorderOutlinedIcon />
          }
        </IconButton>
        <Typography>


          {localLikes}

        </Typography>
      </CardActions>
    </Card>
  )
}
