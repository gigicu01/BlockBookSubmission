import React, { useEffect, useState } from 'react'
import { InfiniteData, useMutation, useQuery, useQueryClient } from 'react-query'
import { fetchProfileById } from '../api/profiles'
import { createTweet, fromRawTweetToTweet, fromTweetRequestToTweet, TweetResponse } from '../api/tweets'
import { TweetForm } from '../components/tweetForm'
import { TweetList } from '../components/tweetList'
import { useAuth } from '../contexts/authContext'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
    container: {
        margin: "4em 0 4em 0"
    }
}))

export const TweetPage = () => {
    const classes = useStyles();
    const { user } = useAuth() // we use the authcontext to be able to get the session and figure out if the user is logged in and get his info
    const { isLoading, isError, data, error } = useQuery(['profile', user?.id], async () => { // trying to get the profile based on userid
        return await fetchProfileById(user!.id)
    }, {
        enabled: !!user?.id,
        staleTime: 3600
    })
    const queryClient = useQueryClient()

//Queries the Supabase database through the use of the Supabase API in order to retrieve the list of tweets. On mutation (when something is changed),
// for example if a new tweet is posted, we trigger this function again to get the list of tweets again so we can show the new tweet as well.

    const mutation = useMutation(createTweet, {
        onMutate: (tweet) => {
            // use the queryClient to get the tweets from the database
            if (tweet) {
                queryClient.setQueryData<InfiniteData<TweetResponse>>(['tweets', user?.id, undefined], old => {
                    const newTweet = fromTweetRequestToTweet(tweet, data!)
                    if (old?.pages && !!old.pages.length) {
                        const [head, ...rest] = old.pages
                        const pages = [
                            {
                                ...head,
                                tweets: [
                                    newTweet,
                                    ...head.tweets
                                ],
                            },
                            ...rest
                        ]
                        return {
                            pages,
                            pageParams: old.pageParams,
                        }
                    }
                    const pages = [{
                        tweets: [newTweet],
                        next: newTweet.createdAt,
                        previous: newTweet.createdAt,
                        hasBeenAddedByMutate: true
                    }]
                    return {
                        pages,
                        pageParams: old?.pageParams || []
                    }
                })
            }
        }
    })
    //actually rendering the page with the list of tweets compiled above
    return (
        <div className={classes.container}>
            {data ? <TweetForm profile={data} submit={mutation.mutate} /> : null}
            <TweetList />
        </div>
    )
}