"use client";

import CircleLoader from "@/components/circle-loader";
import CommonLayout from "@/components/common-layout";
import ManageAccounts from "@/components/manage-accounts";
import UnauthPage from "@/components/unauth-page";
import { GlobalContext } from "@/context";
import { getAllFavorites, getTVorMoviesByGenre } from "@/utils";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect } from "react";

const TV = () => {
  const { data: session } = useSession();

  const {
    loggedInAccount,
    pageLoader,
    mediaData,
    setMediaData,
    setPageLoader,
  } = useContext(GlobalContext);

  useEffect(() => {
    async function getAllMedias() {
      const actionAdventure = await getTVorMoviesByGenre("tv", 10759);
      const crime = await getTVorMoviesByGenre("tv", 80);
      const comedy = await getTVorMoviesByGenre("tv", 35);
      const family = await getTVorMoviesByGenre("tv", 10751);
      const mystery = await getTVorMoviesByGenre("tv", 9648);
      const reality = await getTVorMoviesByGenre("tv", 10764);
      const scifiAndfantasy = await getTVorMoviesByGenre("tv", 10765);
      const war = await getTVorMoviesByGenre("tv", 10768);
      const western = await getTVorMoviesByGenre("tv", 37);
      const dramamedias = await getTVorMoviesByGenre("tv", 18);
      const allFavorites = await getAllFavorites(
        session?.user?.uid,
        loggedInAccount?._id
      );

      setMediaData(
        [
          {
            title: "Action and adventure",
            medias: actionAdventure,
          },
          {
            title: "Crime",
            medias: crime,
          },
          {
            title: "Comedy",
            medias: comedy,
          },
          {
            title: "Family",
            medias: family,
          },
          {
            title: "Action and adventure",
            medias: actionAdventure,
          },
          {
            title: "Mystery",
            medias: mystery,
          },
          {
            title: "Reality",
            medias: reality,
          },
          {
            title: "Sci-Fi and Fantasy",
            medias: scifiAndfantasy,
          },
          {
            title: "Western",
            medias: western,
          },
          {
            title: "War",
            medias: war,
          },
          {
            title: "Dramas",
            medias: dramamedias,
          },
        ].map((item) => ({
          ...item,
          medias: item.medias.map((mediaItem) => ({
            ...mediaItem,
            type: "tv",
            addedToFavorites:
              allFavorites && allFavorites.length
                ? allFavorites.map((fav) => fav.movieID).indexOf(mediaItem) > -1
                : false,
          })),
        }))
      );
      setPageLoader(false);
    }
    getAllMedias();
  }, [loggedInAccount]);

  if (session === null) return <UnauthPage />;
  if (loggedInAccount === null) return <ManageAccounts />;

  if (pageLoader) return <CircleLoader />;

  return (
    <main className="flex min-h-screen flex-col">
      <CommonLayout mediaData={mediaData} />
    </main>
  );
};

export default TV;
