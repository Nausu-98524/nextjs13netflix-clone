"use client";
import CircleLoader from "@/components/circle-loader";
import CommonLayout from "@/components/common-layout";
import ManageAccounts from "@/components/manage-accounts";
import UnauthPage from "@/components/unauth-page";
import { GlobalContext } from "@/context";
import {
  getAllFavorites,
  getPopularMedias,
  getTopRatedMedia,
  getTrandingMedias,
} from "@/utils";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect } from "react";

const Browse = () => {
  const {
    loggedInAccount,
    pageLoader,
    mediaData,
    setMediaData,
    setPageLoader,
  } = useContext(GlobalContext);

  const { data: session } = useSession();

  console.log("session", session);

  useEffect(() => {
    async function getAllMedias() {
      const trendingTvShows = await getTrandingMedias("tv");
      const popularTvShows = await getPopularMedias("tv");
      const topratedTvShows = await getTopRatedMedia("tv");

      const trendingMovieShows = await getTrandingMedias("movie");
      const popularMovieShows = await getPopularMedias("movie");
      const topratedMovieShows = await getTopRatedMedia("movie");
      const allFavorites = await getAllFavorites(
        session?.user?.uid,
        loggedInAccount?._id
      );

      setMediaData([
        ...[
          {
            title: "Trending TV Shows",
            medias: trendingTvShows,
          },
          {
            title: "Popular TV Shows",
            medias: popularTvShows,
          },
          {
            title: "Top rated TV Shows",
            medias: topratedTvShows,
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
        })),
        ...[
          {
            title: "Trending Movies",
            medias: trendingMovieShows,
          },
          {
            title: "Popular Movies",
            medias: popularMovieShows,
          },
          {
            title: "Top rated Movies",
            medias: topratedMovieShows,
          },
        ].map((item) => ({
          ...item,
          medias: item.medias.map((mediaItem) => ({
            ...mediaItem,
            type: "movie",
            addedToFavorites:
              allFavorites && allFavorites.length
                ? allFavorites.map((fav) => fav.movieID).indexOf(mediaItem) > -1
                : false,
          })),
        })),
      ]);

      setPageLoader(false);
    }
    getAllMedias();
  }, []);

  if (session === null) return <UnauthPage />;

  if (loggedInAccount === null) return <ManageAccounts />;

  if (pageLoader) return <CircleLoader />;

  // console.log(mediaData,"jj");

  return (
    <main className="flex min-h-screen flex-col">
      <CommonLayout mediaData={mediaData} />
    </main>
  );
};

export default Browse;
