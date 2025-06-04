import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MassBunkPoll, Friend } from '../types';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

interface MassBunkContextType {
  massBunkPolls: MassBunkPoll[];
  friends: Friend[];
  isLoading: boolean;
  createMassBunkPoll: (poll: Omit<MassBunkPoll, 'id' | 'votes' | 'creatorId'>) => Promise<void>;
  voteMassBunkPoll: (pollId: string, status: 'yes' | 'no' | 'maybe') => Promise<void>;
  addFriend: (rollNumber: string) => Promise<void>;
  acceptFriendRequest: (friendId: string) => Promise<void>;
  rejectFriendRequest: (friendId: string) => Promise<void>;
}

const MassBunkContext = createContext<MassBunkContextType | undefined>(undefined);

export const useMassBunk = () => {
  const context = useContext(MassBunkContext);
  if (context === undefined) {
    throw new Error('useMassBunk must be used within a MassBunkProvider');
  }
  return context;
};

interface MassBunkProviderProps {
  children: ReactNode;
}

export const MassBunkProvider = ({ children }: MassBunkProviderProps) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [massBunkPolls, setMassBunkPolls] = useState<MassBunkPoll[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const storedPolls = localStorage.getItem(`massBunks-${user.id}`);
      const storedFriends = localStorage.getItem(`friends-${user.id}`);
      
      if (storedPolls) {
        setMassBunkPolls(JSON.parse(storedPolls));
      } else {
        // Mock data for demonstration
        const mockPolls: MassBunkPoll[] = [
          {
            id: '1',
            courseId: '2',
            date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
            creatorId: '2',
            description: 'Let\'s skip Data Structures this Friday!',
            votes: [
              { userId: '2', status: 'yes' },
              { userId: '3', status: 'yes' },
              { userId: '4', status: 'maybe' }
            ]
          }
        ];
        setMassBunkPolls(mockPolls);
        localStorage.setItem(`massBunks-${user.id}`, JSON.stringify(mockPolls));
      }
      
      if (storedFriends) {
        setFriends(JSON.parse(storedFriends));
      } else {
        // Mock data for demonstration
        const mockFriends: Friend[] = [
          {
            id: '2',
            username: 'johndoe',
            rollNumber: '20CS101',
            year: 2,
            course: 'Computer Science',
            section: 'A',
            status: 'accepted'
          },
          {
            id: '3',
            username: 'janedoe',
            rollNumber: '20CS102',
            year: 2,
            course: 'Computer Science',
            section: 'A',
            status: 'accepted'
          },
          {
            id: '4',
            username: 'bobsmith',
            rollNumber: '20CS103',
            year: 2,
            course: 'Computer Science',
            section: 'B',
            status: 'pending'
          }
        ];
        setFriends(mockFriends);
        localStorage.setItem(`friends-${user.id}`, JSON.stringify(mockFriends));
      }
    }
    setIsLoading(false);
  }, [user]);

  const createMassBunkPoll = async (pollData: Omit<MassBunkPoll, 'id' | 'votes' | 'creatorId'>) => {
    if (!user) return;
    
    const newPoll: MassBunkPoll = {
      ...pollData,
      id: Date.now().toString(),
      creatorId: user.id,
      votes: [{ userId: user.id, status: 'yes' }]
    };
    
    const updatedPolls = [...massBunkPolls, newPoll];
    setMassBunkPolls(updatedPolls);
    localStorage.setItem(`massBunks-${user.id}`, JSON.stringify(updatedPolls));
    
    // Notify friends
    friends.forEach(friend => {
      if (friend.status === 'accepted') {
        addNotification({
          userId: friend.id,
          message: `${user.username} created a new mass bunk poll for ${new Date(pollData.date).toLocaleDateString()}`,
          type: 'info',
          link: `/massbunk/${newPoll.id}`
        });
      }
    });
  };

  const voteMassBunkPoll = async (pollId: string, status: 'yes' | 'no' | 'maybe') => {
    if (!user) return;
    
    const updatedPolls = massBunkPolls.map(poll => {
      if (poll.id === pollId) {
        const votes = poll.votes.filter(vote => vote.userId !== user.id);
        return {
          ...poll,
          votes: [...votes, { userId: user.id, status }]
        };
      }
      return poll;
    });
    
    setMassBunkPolls(updatedPolls);
    localStorage.setItem(`massBunks-${user.id}`, JSON.stringify(updatedPolls));
    
    // Notify poll creator
    const poll = massBunkPolls.find(p => p.id === pollId);
    if (poll && poll.creatorId !== user.id) {
      addNotification({
        userId: poll.creatorId,
        message: `${user.username} voted "${status}" on your mass bunk poll`,
        type: 'info',
        link: `/massbunk/${pollId}`
      });
    }
  };

  const addFriend = async (rollNumber: string) => {
    if (!user) return;
    
    // In a real app, this would search the database
    // Mock implementation for demonstration
    const mockFriend: Friend = {
      id: Date.now().toString(),
      username: `user_${rollNumber}`,
      rollNumber,
      year: user.year,
      course: user.course,
      section: user.section,
      status: 'pending'
    };
    
    const updatedFriends = [...friends, mockFriend];
    setFriends(updatedFriends);
    localStorage.setItem(`friends-${user.id}`, JSON.stringify(updatedFriends));
    
    addNotification({
      userId: mockFriend.id,
      message: `${user.username} sent you a friend request`,
      type: 'info',
      link: '/profile'
    });
  };

  const acceptFriendRequest = async (friendId: string) => {
    if (!user) return;
    
    const updatedFriends = friends.map(friend => 
      friend.id === friendId ? { ...friend, status: 'accepted' } : friend
    );
    
    setFriends(updatedFriends);
    localStorage.setItem(`friends-${user.id}`, JSON.stringify(updatedFriends));
    
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      addNotification({
        userId: friendId,
        message: `${user.username} accepted your friend request`,
        type: 'success',
        link: '/profile'
      });
    }
  };

  const rejectFriendRequest = async (friendId: string) => {
    if (!user) return;
    
    const updatedFriends = friends.filter(friend => friend.id !== friendId);
    setFriends(updatedFriends);
    localStorage.setItem(`friends-${user.id}`, JSON.stringify(updatedFriends));
  };

  return (
    <MassBunkContext.Provider
      value={{
        massBunkPolls,
        friends,
        isLoading,
        createMassBunkPoll,
        voteMassBunkPoll,
        addFriend,
        acceptFriendRequest,
        rejectFriendRequest
      }}
    >
      {children}
    </MassBunkContext.Provider>
  );
};