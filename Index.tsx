import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Sparkles } from 'lucide-react';
import { EmailCard } from '@/components/EmailCard';
import { ActionButtons } from '@/components/ActionButtons';
import { StatsBar } from '@/components/StatsBar';
import { ReplyModal } from '@/components/ReplyModal';
import { EmptyState } from '@/components/EmptyState';
import { mockEmails } from '@/data/mockEmails';
import { Email } from '@/types/email';
import { toast } from 'sonner';

const Index = () => {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [trashedCount, setTrashedCount] = useState(0);
  const [keptCount, setKeptCount] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const currentEmail = emails[0];

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (!currentEmail) return;

    if (direction === 'left') {
      setTrashedCount(prev => prev + 1);
      toast.info('Email trashed', { icon: '🗑️' });
    } else {
      setKeptCount(prev => prev + 1);
      toast.success('Email kept', { icon: '✓' });
    }

    setEmails(prev => prev.slice(1));
  }, [currentEmail]);

  const handleDoubleTap = useCallback(() => {
    if (!currentEmail) return;
    setSelectedEmail(currentEmail);
    setIsReplyOpen(true);
  }, [currentEmail]);

  const handleReplyClose = () => {
    setIsReplyOpen(false);
    setTimeout(() => setSelectedEmail(null), 300);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header 
        className="px-6 py-4 flex items-center justify-between border-b border-border/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-reply flex items-center justify-center">
            <Mail className="w-5 h-5 text-info-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground">SwipeMail</h1>
            <p className="text-xs text-muted-foreground">Tinder for your inbox</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
          <Sparkles className="w-3 h-3 text-info" />
          <span>AI-Powered</span>
        </div>
      </motion.header>

      {/* Stats */}
      <StatsBar 
        total={mockEmails.length} 
        trashed={trashedCount} 
        kept={keptCount} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {emails.length > 0 ? (
          <>
            {/* Card Stack */}
            <div className="relative w-full max-w-md h-[420px] flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {emails.slice(0, 3).map((email, index) => (
                  <EmailCard
                    key={email.id}
                    email={email}
                    isTop={index === 0}
                    onSwipe={handleSwipe}
                    onDoubleTap={handleDoubleTap}
                  />
                )).reverse()}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <ActionButtons
              onTrash={() => handleSwipe('left')}
              onKeep={() => handleSwipe('right')}
              onReply={handleDoubleTap}
              disabled={!currentEmail}
            />
          </>
        ) : (
          <EmptyState trashed={trashedCount} kept={keptCount} />
        )}
      </main>

      {/* Reply Modal */}
      {selectedEmail && (
        <ReplyModal
          email={selectedEmail}
          isOpen={isReplyOpen}
          onClose={handleReplyClose}
        />
      )}
    </div>
  );
};

export default Index;
