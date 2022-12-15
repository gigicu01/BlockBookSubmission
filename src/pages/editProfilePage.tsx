import { makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Redirect } from "react-router";
import { supabaseClient } from "../api/supabaseClient";
import { ProfileForm, ProfileFormProps } from "../components/profileForm";
import { PROFILES_TABLE } from "../constants";
import { useAuth } from "../contexts/authContext";
import { useProfile } from "../hooks/useProfile";
import { PageLoading } from "../components/pageLoading";
import { UploadButton } from '../components/uploadButton';
import { useUpload } from '../hooks/useUpload';
import { definitions } from '../api/types';
import { UserAvartar } from '../components/userAvatar';

export type CreateProfilePageProps = {};

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "4em 0 0 0",
    padding: "6em 0 6em 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: "1.5em 0 1em 0",
    width: "8em",
    height: "8em"
  }
}));
//Handles the editing of the User profile page from username checking to profile avatar upload
const EditProfilePage: React.FC<CreateProfilePageProps> = ({}) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, profileError, profileLoading] = useProfile("id", user?.id);
  const [usernameExists, setUsernameExists] = useState(false)
  const [onUpload, uploadedAvatarUrl, uploadError, isUploading] = useUpload(user)


  if (profileLoading) { //if the page is not loading it will send it to a loading page
    return <PageLoading />;
  }

  const onSubmit: ProfileFormProps["onSubmit"] = async ({
    username,
    website,
  }) => {
    setUsernameExists(false) //checks to see if the username exists
    setSaved(false);
    setIsSubmitting(true);
    const { error } = await supabaseClient.from<definitions["profiles"]>(PROFILES_TABLE).upsert({
      id: user?.id,
      username,
      website,
      avatar_url: uploadedAvatarUrl ?? undefined
    });

    if (!error) {
      setSaved(true);
    } else { 
        if(error.code === "23505") { // duplicate key value violates unique constraint
            setUsernameExists(true)
        }
    } 
    setIsSubmitting(false);
  };
//if no errors the page will render and show that the edited profile has been saved
  return (
    <Paper variant="outlined" className={classes.paper}>
      <Typography variant="h5" align="center">
        {profile ? "Edit Your Profile" : "Create Your Profile"}
      </Typography>
      <UserAvartar name={profile?.username || user?.email} path={uploadedAvatarUrl || profile?.avatar_url} className={classes.avatar} />
      <UploadButton onUpload={onUpload} />
      <ProfileForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        usernameExists={usernameExists}
        username={profile?.username}
        website={profile?.website}
      >
      </ProfileForm>
      {saved && <Typography>Saved!</Typography>}
    </Paper>
  );
};

export default EditProfilePage;
