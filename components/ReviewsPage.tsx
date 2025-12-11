import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Star, MessageSquare, Plus, Filter, X } from 'lucide-react';
import { Review, Tool, User } from '../types';

interface ReviewsPageProps {
  reviews: Review[];
  tools: Tool[];
  users: User[];
  currentUser: User;
  initialToolFilter: string | null;
  onAddReview: (review: Review) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ 
  reviews, tools, users, currentUser, initialToolFilter, onAddReview 
}) => {
  const [filterToolId, setFilterToolId] = useState<string>(initialToolFilter || 'all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [selectedToolId, setSelectedToolId] = useState(tools[0]?.id || '');

  const filteredReviews = useMemo(() => {
    let result = reviews;
    if (filterToolId !== 'all') {
      result = result.filter(r => r.toolId === filterToolId);
    }
    // Sort by newest first
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [reviews, filterToolId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const review: Review = {
      id: crypto.randomUUID(),
      toolId: selectedToolId,
      userId: currentUser.id, // Always use current user
      rating: newRating,
      comment: newComment,
      timestamp: new Date().toISOString()
    };
    onAddReview(review);
    setIsModalOpen(false);
    setNewComment('');
    setNewRating(5);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
             <Filter className="w-4 h-4 text-gray-500" />
             <span className="text-sm font-medium text-gray-700">Filter:</span>
             <select 
                value={filterToolId}
                onChange={(e) => setFilterToolId(e.target.value)}
                className="bg-transparent text-sm font-semibold text-gray-900 outline-none cursor-pointer"
             >
                <option value="all">Todas as Ferramentas</option>
                {tools.map(tool => (
                <option key={tool.id} value={tool.id}>{tool.name}</option>
                ))}
             </select>
          </div>
          
          {filterToolId !== 'all' && (
              <button 
                onClick={() => setFilterToolId('all')}
                className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1"
              >
                  <X className="w-3 h-3" /> Clear
              </button>
          )}
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nova Avaliação
        </button>
      </div>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <MessageSquare className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Sem avaliações ainda</h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-1">
             {filterToolId !== 'all' 
                ? 'Esta ferramenta ainda não tem avaliações.' 
                : 'Seja o primeiro a avaliar uma ferramenta da equipa.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map(review => {
            const tool = tools.find(t => t.id === review.toolId);
            const user = users.find(u => u.id === review.userId);
            
            return (
              <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user?.avatarUrl} 
                      alt={user?.name} 
                      className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{user?.name || 'Utilizador Desconhecido'}</h4>
                      <span className="text-xs text-gray-500 block">
                        {format(new Date(review.timestamp), "d 'de' MMM, HH:mm", { locale: pt })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex-1">
                  <div className="flex items-center justify-between mb-3">
                     <span 
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider" 
                        style={{ backgroundColor: `${tool?.color}15`, color: tool?.color }}
                     >
                        {tool?.name}
                     </span>
                     <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(star => (
                            <Star 
                                key={star} 
                                className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                            />
                        ))}
                     </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic">"{review.comment}"</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Adicionar Avaliação</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Posting As Banner */}
              <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3">
                <img src={currentUser.avatarUrl} className="w-8 h-8 rounded-full border border-blue-200" alt="" />
                <div className="text-sm">
                   <span className="text-gray-500">Publicando como</span>
                   <p className="font-bold text-blue-900">{currentUser.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ferramenta</label>
                <select 
                  value={selectedToolId}
                  onChange={(e) => setSelectedToolId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tools.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Classificação</label>
                <div className="flex gap-2 justify-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`p-1 transition-transform hover:scale-110 ${newRating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comentário</label>
                <textarea
                  required
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Partilhe a sua experiência com esta ferramenta..."
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                >
                  Publicar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};