import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminProductsApi, adminReviewsApi } from "@/lib/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  MessageSquare,
  EyeOff,
  ThumbsUp,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  images: string[];
  slug: string;
}

interface Review {
  _id: string;
  productId: Product;
  customerName: string;
  customerPhone?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  isVisible: boolean;
  adminReply?: string;
  adminReplyDate?: string;
  createdAt: string;
  updatedAt: string;
}

const ratingColors = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-blue-500',
  5: 'bg-green-500'
};

export default function AdminReviews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [replyingToReview, setReplyingToReview] = useState<Review | null>(null);
  const [adminReply, setAdminReply] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
    fetchProducts();
    fetchStats();
  }, [ratingFilter, visibilityFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (ratingFilter !== 'all') params.rating = ratingFilter;
      if (visibilityFilter !== 'all') params.isVisible = visibilityFilter === 'visible';
      
      const response = await adminReviewsApi.getAll(params) as any;
      if (response.success) {
        setReviews(response.data || []);
      }
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await adminProductsApi.getAll() as any;
      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminReviewsApi.getStats() as any;
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching review stats:', err);
    }
  };

  const handleToggleVisibility = async (reviewId: string) => {
    try {
      const response = await adminReviewsApi.toggleVisibility(reviewId) as any;
      if (response.success) {
        await fetchReviews();
        await fetchStats();
      }
    } catch (err) {
      console.error('Error toggling review visibility:', err);
    }
  };

  const handleAddReply = async () => {
    if (!replyingToReview || !adminReply.trim()) return;

    try {
      const response = await adminReviewsApi.addReply(replyingToReview._id, adminReply) as any;
      if (response.success) {
        await fetchReviews();
        setShowReplyDialog(false);
        setReplyingToReview(null);
        setAdminReply("");
      }
    } catch (err) {
      console.error('Error adding admin reply:', err);
    }
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      const response = await adminReviewsApi.delete(reviewToDelete._id) as any;
      if (response.success) {
        await fetchReviews();
        await fetchStats();
        setDeleteDialogOpen(false);
        setReviewToDelete(null);
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    return (
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visible</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.visibleReviews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <ThumbsUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verifiedReviews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating?.toFixed(1) || '0.0'}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Reviews Management</CardTitle>
          <CardDescription>
            Manage customer reviews, moderate content, and add admin replies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews by customer, product, or content..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowReviewForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Review
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{review.customerName}</div>
                        {review.customerPhone && (
                          <div className="text-sm text-muted-foreground">
                            {review.customerPhone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{review.productId?.name || 'Unknown Product'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                        <Badge className={`ml-2 ${ratingColors[review.rating as keyof typeof ratingColors]} text-white`}>
                          {review.rating}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div>
                        <div className="font-medium truncate">{review.title}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {review.comment}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={review.isVisible ? "default" : "secondary"}>
                          {review.isVisible ? "Visible" : "Hidden"}
                        </Badge>
                        {review.isVerified && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(review.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setEditingReview(review)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setReplyingToReview(review);
                              setAdminReply(review.adminReply || "");
                              setShowReplyDialog(true);
                            }}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            {review.adminReply ? 'Edit Reply' : 'Add Reply'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleVisibility(review._id)}>
                            {review.isVisible ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Hide Review
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Show Review
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setReviewToDelete(review);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reviews found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {replyingToReview?.adminReply ? 'Edit Admin Reply' : 'Add Admin Reply'}
            </DialogTitle>
            <DialogDescription>
              Reply to {replyingToReview?.customerName}'s review for {replyingToReview?.productId?.name}
            </DialogDescription>
          </DialogHeader>
          
          {replyingToReview && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-1 mb-2">
                  {renderStars(replyingToReview.rating)}
                </div>
                <h4 className="font-medium">{replyingToReview.title}</h4>
                <p className="text-sm text-muted-foreground">{replyingToReview.comment}</p>
              </div>
              
              <Textarea
                placeholder="Write your admin reply..."
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                rows={4}
              />
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReply} disabled={!adminReply.trim()}>
              {replyingToReview?.adminReply ? 'Update Reply' : 'Add Reply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review from {reviewToDelete?.customerName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReview} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
