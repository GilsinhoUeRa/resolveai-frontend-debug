
import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Review as ReviewType, ProviderDetails, UserType } from '@/types';
import MyReviewCard from '@/components/MyReviewCard';
import Button from '@/components/Button';
import { APP_ROUTES, COLORS } from '@/constants';
import ProfilePageSkeleton from '@/components/skeletons/ProfilePageSkeleton';
import { useToast } from '@/hooks/useToast';
import StarRating from '@/components/StarRating';
import Textarea from '@/components/Textarea';
import Card from '@/components/Card';
// import { MOCK_REVIEWS, MOCK_PROVIDERS_DETAILS_DATA } from '@/constants/mockData'; // Removido

interface UserReview extends ReviewType {
  provider?: ProviderDetails;
}

const MyReviewsPage: React.FC = () => {
  const { user, loading: authLoading, allUsers } = useAuth();
  const { addToast } = useToast();

  // TODO: `managedReviews` deve ser completamente substituído por chamadas de API.
  // Nenhuma avaliação deve ser gerenciada no estado do frontend desta forma.
  // Este estado é mantido temporariamente para a UI de edição/exclusão funcionar.
  const [managedReviews, setManagedReviews] = useState<ReviewType[]>([]);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingReview, setEditingReview] = useState<ReviewType | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  useEffect(() => {
    // Carrega as "reviews" do localStorage para manter a UI funcional durante a transição
    const mockReviewsFromStorage = localStorage.getItem('resolveai_mock_reviews');
    const allMockReviews: ReviewType[] = mockReviewsFromStorage ? JSON.parse(mockReviewsFromStorage) : [];
    setManagedReviews(allMockReviews);
  }, []);


  useEffect(() => {
    // TODO: Substituir por chamada à API: fetch(`/api/reviews?userId=${user.id}`)
    if (!user || authLoading) {
      if (!authLoading) setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setTimeout(() => { // Simula delay da API
      const currentUserId = user.id;
      // Filtra de `managedReviews` (que é um mock temporário do localStorage)
      const reviewsByCurrentUser = managedReviews.filter(review => review.clientId === currentUserId);

      const reviewsWithProviderData = reviewsByCurrentUser.map(review => {
        const provider = allUsers.find(p => p.id === review.providerId && p.userType === UserType.PROVIDER) as ProviderDetails | undefined;
        return { ...review, provider };
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setUserReviews(reviewsWithProviderData);
      setIsLoading(false);
    }, 500); 
  }, [user, authLoading, managedReviews, allUsers]);

  const handleEditRequest = (review: ReviewType) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    if (editRating === 0) {
      addToast('Por favor, selecione uma nota (estrelas).', 'error');
      return;
    }
    if (!editComment.trim()) {
      addToast('Por favor, escreva um comentário.', 'error');
      return;
    }

    setIsSubmittingEdit(true);
    // TODO: Substituir por chamada à API: fetch(`/api/reviews/${editingReview.id}`, { method: 'PUT', body: { rating, comment } })
    
    setTimeout(() => { // Simula API
      setManagedReviews(prevManagedReviews =>
        prevManagedReviews.map(r =>
          r.id === editingReview.id
            ? { ...r, rating: editRating, comment: editComment, date: new Date().toISOString() }
            : r
        )
      );
      // Atualiza o localStorage (temporário)
      const updatedMockReviews = managedReviews.map(r =>
        r.id === editingReview.id
          ? { ...r, rating: editRating, comment: editComment, date: new Date().toISOString() }
          : r
      );
      localStorage.setItem('resolveai_mock_reviews', JSON.stringify(updatedMockReviews));


      addToast('Avaliação atualizada com sucesso! (Simulado)', 'success');
      setEditingReview(null);
      setIsSubmittingEdit(false);
    }, 1000);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleDeleteRequest = async (reviewId: string) => {
    // TODO: Substituir por chamada à API: fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' })
    if (window.confirm('Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.')) {
      // Simula API
      setManagedReviews(prevManagedReviews => prevManagedReviews.filter(r => r.id !== reviewId));
      
      // Atualiza o localStorage (temporário)
      const updatedMockReviews = managedReviews.filter(r => r.id !== reviewId);
      localStorage.setItem('resolveai_mock_reviews', JSON.stringify(updatedMockReviews));

      addToast('Avaliação excluída com sucesso! (Simulado)', 'success');
    }
  };

  const renderEditForm = () => {
    if (!editingReview) return null;

    const providerBeingReviewed = allUsers.find(p => p.id === editingReview.providerId && p.userType === UserType.PROVIDER) as ProviderDetails | undefined;
    
    return (
      <Card className="mb-8 p-6 bg-orange-energia/5 shadow-lg border border-orange-energia/50">
        <h2 className="text-2xl font-semibold text-grafite-profundo mb-1">Editando Avaliação</h2>
        {providerBeingReviewed && (
          <p className="text-md text-cinza-neutro mb-4">
            Para: <Link to={`${APP_ROUTES.PROVIDER_PROFILE}/${providerBeingReviewed.id}`} className="text-orange-energia hover:underline">{providerBeingReviewed.name}</Link>
          </p>
        )}
        <form onSubmit={handleConfirmEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-grafite-profundo mb-1">Sua Nota:</label>
            <StarRating rating={editRating} onRate={setEditRating} size={28} />
          </div>
          <Textarea
            label="Seu Comentário:"
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            rows={4}
            required
          />
          <div className="flex gap-4">
            <Button type="submit" isLoading={isSubmittingEdit} variant="primary">
              {isSubmittingEdit ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button type="button" onClick={handleCancelEdit} variant="ghost" disabled={isSubmittingEdit}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    );
  };

  if (isLoading || authLoading) {
    return <ProfilePageSkeleton />;
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-grafite-profundo">Por favor, faça login para ver suas avaliações.</p>
        <Link to={APP_ROUTES.LOGIN} className="mt-4 inline-block">
          <Button variant="primary">Ir para Login</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-grafite-profundo">Minhas Avaliações</h1>
        <p className="text-lg text-cinza-neutro">Aqui estão todos os feedbacks que você compartilhou.</p>
      </header>

      {renderEditForm()}

      {userReviews.length > 0 ? (
        <div className="space-y-6">
          {userReviews.map(review => (
            <MyReviewCard 
              key={review.id} 
              review={review} 
              provider={review.provider} 
              onEditRequest={handleEditRequest}
              onDeleteRequest={handleDeleteRequest}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white p-8 rounded-lg shadow-md">
          <svg className="mx-auto h-16 w-16 text-cinza-neutro mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.412 15.655L9.204 17.863m3.101-4.473L15 11.935M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5M5.625 19.5h12.75" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21V3M16.5 21V3" />
          </svg>
          <h3 className="mt-2 text-xl font-semibold text-grafite-profundo">Você ainda não escreveu nenhuma avaliação.</h3>
          <p className="mt-2 text-md text-cinza-neutro">
            Compartilhe sua experiência para ajudar outros usuários e os prestadores de serviço.
          </p>
          <div className="mt-6">
            <Link to={APP_ROUTES.PROVIDERS}>
              <Button variant="primary" size="lg">
                Encontrar Prestadores para Avaliar
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;
