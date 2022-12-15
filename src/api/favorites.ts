import { supabaseClient } from "./supabaseClient"
//Enables the user to favorite tweets
export const toggleFavorite = async (u_id: string, t_id: number) => {
    const { data, error } =  await supabaseClient.rpc('toggle_favorite', {
        u_id, t_id
    })
    if(error) {
        throw error;
    }
    return true
}
//retrieves favorited tweets by tweet id
export const getFavoriteByIds = async (ids: number[]) => {
    const { data, error} = await supabaseClient.rpc('get_favorited_tweets_by_id', {
        f_ids: ids
    })
    if(error) {
        throw error;
    }
    return data
}