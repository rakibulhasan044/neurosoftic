"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/reviews/product/${productId}?page=${pageNum}&limit=5`);
      if (res.ok) {
        const json = await res.json();
        if (pageNum === 1) {
          setReviews(json.reviews);
        } else {
          setReviews(prev => [...prev, ...json.reviews]);
        }
        setTotalReviews(json.meta.total);
        setHasMore(pageNum < json.meta.totalPages);
      }
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [productId]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to leave a review.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId, rating, comment })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Review submitted successfully!");
        setComment("");
        setRating(5);
        setPage(1);
        fetchReviews(1);
      } else {
        toast.error(data.message || "Failed to submit review.");
      }
    } catch (err) {
      toast.error("An error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-border/50">
      <h2 className="text-2xl font-bold mb-8 flex items-center">
        <MessageSquare className="mr-3 h-6 w-6 text-primary" />
        Customer Reviews ({totalReviews})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Write a review form */}
        <div className="md:col-span-1">
          <div className="bg-muted/30 p-6 rounded-xl border border-border/50">
            <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`h-6 w-6 ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <Textarea 
                  placeholder="Share your experience with this product..." 
                  className="resize-none" 
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2 space-y-6">
          {reviews.length === 0 && !loading && (
            <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </div>
          )}

          {reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b border-border/50 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{review.user?.name || "Customer"}</p>
                  <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-4 w-4 ${review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm mt-3">{review.comment}</p>
            </div>
          ))}

          {hasMore && (
            <div className="text-center pt-4">
              <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More Reviews"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
