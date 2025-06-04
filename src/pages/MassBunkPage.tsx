import React, { useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import { useMassBunk } from '../context/MassBunkContext';
import { useCourses } from '../context/CourseContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { UserSearch, Calendar, Check, X, AlertTriangle, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MassBunkPage: React.FC = () => {
  const { user } = useAuth();
  const { courses } = useCourses();
  const { 
    massBunkPolls, 
    friends, 
    createMassBunkPoll, 
    voteMassBunkPoll, 
    addFriend,
    acceptFriendRequest,
    rejectFriendRequest 
  } = useMassBunk();
  
  const [searchInput, setSearchInput] = useState('');
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [newPollData, setNewPollData] = useState({
    courseId: '',
    date: '',
    description: ''
  });
  
  const pendingFriends = friends.filter(f => f.status === 'pending');
  const activeFriends = friends.filter(f => f.status === 'accepted');
  
  const handleAddFriend = async () => {
    if (!searchInput.trim()) return;
    
    try {
      await addFriend(searchInput);
      setSearchInput('');
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };
  
  const handlePollInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewPollData({
      ...newPollData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPollData.courseId || !newPollData.date || !newPollData.description) return;
    
    try {
      await createMassBunkPoll(newPollData);
      setNewPollData({
        courseId: '',
        date: '',
        description: ''
      });
      setIsCreatingPoll(false);
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };
  
  const formatPollDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getUserVoteStatus = (pollId: string) => {
    if (!user) return null;
    
    const poll = massBunkPolls.find(p => p.id === pollId);
    if (!poll) return null;
    
    const vote = poll.votes.find(v => v.userId === user.id);
    return vote ? vote.status : null;
  };
  
  const getVotesCount = (pollId: string, status: 'yes' | 'no' | 'maybe') => {
    const poll = massBunkPolls.find(p => p.id === pollId);
    if (!poll) return 0;
    
    return poll.votes.filter(v => v.status === status).length;
  };
  
  const isMobile = window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isMobile={isMobile} />
      
      <div className={`${isMobile ? 'pt-16 pl-0' : 'pl-16 lg:pl-64'} transition-all duration-300`}>
        <main className="p-4 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Mass Bunk Coordination</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              {/* Add Friends Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Friends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter roll number..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Button onClick={handleAddFriend}>
                      <UserSearch className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  {/* Pending Friend Requests */}
                  {pendingFriends.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">
                        Pending Requests ({pendingFriends.length})
                      </h3>
                      <div className="space-y-2">
                        {pendingFriends.map(friend => (
                          <div key={friend.id} className="bg-yellow-50 p-3 rounded-md flex items-center justify-between">
                            <div>
                              <p className="font-medium">{friend.username}</p>
                              <p className="text-xs text-gray-500">{friend.rollNumber}</p>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                className="p-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
                                onClick={() => acceptFriendRequest(friend.id)}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                className="p-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                                onClick={() => rejectFriendRequest(friend.id)}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Friends List */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Friends ({activeFriends.length})
                    </h3>
                    
                    {activeFriends.length > 0 ? (
                      <div className="space-y-2">
                        {activeFriends.map(friend => (
                          <div key={friend.id} className="bg-white border p-3 rounded-md">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span className="text-xs font-bold text-blue-600">
                                  {friend.username.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{friend.username}</p>
                                <p className="text-xs text-gray-500">{friend.rollNumber}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No friends added yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Create Mass Bunk Poll */}
              <Card>
                <CardHeader>
                  <CardTitle>Create Mass Bunk Poll</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isCreatingPoll ? (
                    <div className="flex justify-center">
                      <Button
                        onClick={() => setIsCreatingPoll(true)}
                        fullWidth
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Create New Poll
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleCreatePoll}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Course
                          </label>
                          <select
                            name="courseId"
                            value={newPollData.courseId}
                            onChange={handlePollInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">-- Select Course --</option>
                            {courses.map(course => (
                              <option key={course.id} value={course.id}>
                                {course.code}: {course.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <Input
                          label="Date"
                          type="date"
                          name="date"
                          value={newPollData.date}
                          onChange={handlePollInputChange}
                          required
                        />
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={newPollData.description}
                            onChange={handlePollInputChange as any}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows={3}
                            placeholder="Why do you want to bunk this class?"
                            required
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsCreatingPoll(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Create Poll</Button>
                        </div>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Active Mass Bunk Polls</CardTitle>
                </CardHeader>
                <CardContent>
                  {massBunkPolls.length > 0 ? (
                    <div className="space-y-4">
                      {massBunkPolls.map(poll => {
                        const course = courses.find(c => c.id === poll.courseId);
                        const userVoteStatus = getUserVoteStatus(poll.id);
                        const totalVotes = poll.votes.length;
                        const yesPercentage = Math.round((getVotesCount(poll.id, 'yes') / totalVotes) * 100);
                        
                        return (
                          <div key={poll.id} className="border rounded-lg overflow-hidden">
                            <div className="p-4 bg-white">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-lg">{course?.name || 'Unknown Course'}</h3>
                                  <p className="text-sm text-gray-500">
                                    <Calendar className="h-4 w-4 inline-block mr-1" />
                                    {formatPollDate(poll.date)}
                                  </p>
                                </div>
                                
                                {userVoteStatus && (
                                  <span className={`
                                    px-2 py-1 text-xs font-medium rounded-full
                                    ${userVoteStatus === 'yes' ? 'bg-green-100 text-green-800' : 
                                      userVoteStatus === 'no' ? 'bg-red-100 text-red-800' : 
                                      'bg-yellow-100 text-yellow-800'}
                                  `}>
                                    You voted: {userVoteStatus}
                                  </span>
                                )}
                              </div>
                              
                              <p className="my-3 text-gray-700">{poll.description}</p>
                              
                              <div className="bg-gray-100 rounded-md p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">Mass Bunk Status</span>
                                  <span className="text-sm font-medium">
                                    {yesPercentage}% in favor ({getVotesCount(poll.id, 'yes')}/{totalVotes})
                                  </span>
                                </div>
                                
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="h-2.5 rounded-full bg-green-600" 
                                    style={{ width: `${yesPercentage}%` }}
                                  ></div>
                                </div>
                                
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                  <div className="text-center p-1 bg-green-50 rounded">
                                    <p className="text-xs text-gray-600">Yes</p>
                                    <p className="font-medium text-green-700">{getVotesCount(poll.id, 'yes')}</p>
                                  </div>
                                  <div className="text-center p-1 bg-red-50 rounded">
                                    <p className="text-xs text-gray-600">No</p>
                                    <p className="font-medium text-red-700">{getVotesCount(poll.id, 'no')}</p>
                                  </div>
                                  <div className="text-center p-1 bg-yellow-50 rounded">
                                    <p className="text-xs text-gray-600">Maybe</p>
                                    <p className="font-medium text-yellow-700">{getVotesCount(poll.id, 'maybe')}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Vote buttons */}
                              {!userVoteStatus && (
                                <div className="mt-4 flex space-x-2">
                                  <Button
                                    variant="outline"
                                    className="flex-1 border-green-500 text-green-700 hover:bg-green-50"
                                    onClick={() => voteMassBunkPoll(poll.id, 'yes')}
                                  >
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    I'm In
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="flex-1 border-red-500 text-red-700 hover:bg-red-50"
                                    onClick={() => voteMassBunkPoll(poll.id, 'no')}
                                  >
                                    <ThumbsDown className="h-4 w-4 mr-1" />
                                    I'm Out
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="flex-1 border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                                    onClick={() => voteMassBunkPoll(poll.id, 'maybe')}
                                  >
                                    <HelpCircle className="h-4 w-4 mr-1" />
                                    Maybe
                                  </Button>
                                </div>
                              )}
                              
                              {/* Status message */}
                              {yesPercentage >= 75 ? (
                                <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-md flex items-center">
                                  <Check className="h-5 w-5 text-green-600 mr-2" />
                                  <span className="text-sm text-green-700">
                                    Mass bunk likely to happen! ({yesPercentage}% agreed)
                                  </span>
                                </div>
                              ) : (
                                <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
                                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                                  <span className="text-sm text-yellow-700">
                                    Not enough people have agreed yet. Keep sharing!
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-10 text-center">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No active polls</h3>
                      <p className="text-sm text-gray-500">Create a new mass bunk poll to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MassBunkPage;