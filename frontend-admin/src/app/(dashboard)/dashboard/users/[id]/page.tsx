'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, FileText, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState, ErrorState } from '@/components/shared/states';
import { usersService } from '@/services';
import type { User } from '@/types';

interface Application {
  id: string;
  job?: {
    title: string;
  };
  createdAt: string;
  status: string;
}

interface UserWithApplications extends User {
  applications?: Application[];
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<UserWithApplications>({
    queryKey: ['user', id],
    queryFn: () => usersService.getUserById(id) as Promise<UserWithApplications>,
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error as Error} retry={refetch} />;
  if (!user) return <ErrorState error={new Error('User not found')} retry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground">View and manage user information</p>
          </div>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold">{user.name?.charAt(0)}</span>
                </div>
              )}
              <div className="mt-4 space-y-1">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Badge
                  variant={
                    user.role === 'ADMIN'
                      ? 'default'
                      : user.role === 'EMPLOYER'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {user.role}
                </Badge>
                <Badge variant={user.isActive ? 'default' : 'destructive'}>{user.status}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <div className="space-y-3">
              {user.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="break-all">{user.email}</span>
                </div>
              )}
              {(user.city || user.country) && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{[user.city, user.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {format(new Date(user.createdAt), 'MMM dd, yyyy')}</span>
              </div>
              {user.lastLoginAt && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Last login {format(new Date(user.lastLoginAt), 'MMM dd, yyyy')}</span>
                </div>
              )}
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{user._count?.applications || 0}</div>
                <div className="text-xs text-muted-foreground">Applications</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{user._count?.savedJobs || 0}</div>
                <div className="text-xs text-muted-foreground">Saved Jobs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="overview">
            <CardHeader>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">{user.bio || 'No bio available'}</p>
                </div>

                {user.address && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Address</h3>
                    <p className="text-sm text-muted-foreground">{user.address}</p>
                  </div>
                )}

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                  <div className="grid gap-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email Verified</span>
                      <Badge variant={user.isEmailVerified ? 'default' : 'secondary'}>
                        {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Account Status</span>
                      <Badge variant={user.isActive ? 'default' : 'destructive'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gender</span>
                      <span>{user.gender || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date of Birth</span>
                      <span>
                        {user.dateOfBirth
                          ? format(new Date(user.dateOfBirth), 'MMM dd, yyyy')
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activity data available yet</p>
                </div>
              </TabsContent>

              <TabsContent value="applications" className="space-y-4">
                {user.applications && user.applications.length > 0 ? (
                  <div className="space-y-3">
                    {user.applications.map((application) => (
                      <Card key={application.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{application.job?.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Applied {format(new Date(application.createdAt), 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <Badge>{application.status}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No applications yet</p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
