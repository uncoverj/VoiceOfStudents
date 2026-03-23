import { useQueryClient } from "@tanstack/react-query";
import {
  useListPosts as useGeneratedListPosts,
  useGetPost as useGeneratedGetPost,
  useCreatePost as useGeneratedCreatePost,
  useLikePost as useGeneratedLikePost,
  useCreateComment as useGeneratedCreateComment,
  ListPostsParams,
} from "@workspace/api-client-react";

export function usePosts(params?: ListPostsParams) {
  return useGeneratedListPosts(params);
}

export function usePost(id: number) {
  return useGeneratedGetPost(id);
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useGeneratedCreatePost({
    mutation: {
      onSuccess: () => {
        // Invalidate posts list and admin stats when a new post is created
        queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      }
    }
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  return useGeneratedLikePost({
    mutation: {
      onSuccess: (_, variables) => {
        // Invalidate both the list view and the specific post view
        queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
        queryClient.invalidateQueries({ queryKey: [`/api/posts/${variables.id}`] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      }
    }
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useGeneratedCreateComment({
    mutation: {
      onSuccess: (_, variables) => {
        // Invalidate the post detail and list view
        queryClient.invalidateQueries({ queryKey: [`/api/posts/${variables.id}`] });
        queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      }
    }
  });
}
