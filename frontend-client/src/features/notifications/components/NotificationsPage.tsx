import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  notificationsService,
  Notification,
  NotificationType,
} from '../services/notificationsService';
import { toast } from '@/lib/toast';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  Briefcase,
  FileText,
  MessageSquare,
  Calendar,
  AlertCircle,
  Building2,
  X,
  Filter,
} from 'lucide-react';

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [page, filter]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const isRead = filter === 'unread' ? false : undefined;
      const response = await notificationsService.getNotifications(page, 20, isRead);
      setNotifications(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      toast.error('Không thể tải thông báo');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications(
        notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success('Đã đánh dấu đã đọc');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('Đã đánh dấu tất cả đã đọc');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationsService.deleteNotification(notificationId);
      setNotifications(notifications.filter((n) => n.id !== notificationId));
      toast.success('Đã xóa thông báo');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Bạn có chắc muốn xóa tất cả thông báo?')) return;

    try {
      await notificationsService.deleteAll();
      setNotifications([]);
      setUnreadCount(0);
      toast.success('Đã xóa tất cả thông báo');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error(error);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.NEW_APPLICATION:
      case NotificationType.APPLICATION_STATUS:
        return <FileText className="w-5 h-5 text-blue-600" />;
      case NotificationType.NEW_JOB:
        return <Briefcase className="w-5 h-5 text-green-600" />;
      case NotificationType.NEW_MESSAGE:
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case NotificationType.INTERVIEW_SCHEDULED:
        return <Calendar className="w-5 h-5 text-orange-600" />;
      case NotificationType.COMPANY_VERIFIED:
        return <Building2 className="w-5 h-5 text-teal-600" />;
      case NotificationType.JOB_DEADLINE:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on type and data
    if (notification.data) {
      const data = notification.data as Record<string, string>;
      switch (notification.type) {
        case NotificationType.NEW_APPLICATION:
        case NotificationType.APPLICATION_STATUS:
          if (data.applicationId) {
            navigate(`/company/applications`);
          }
          break;
        case NotificationType.NEW_JOB:
          if (data.jobId) {
            navigate(`/jobs/${data.jobId}`);
          }
          break;
        case NotificationType.INTERVIEW_SCHEDULED:
          if (data.interviewId) {
            navigate(`/company/interviews/${data.interviewId}`);
          }
          break;
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle>Thông báo</CardTitle>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Bạn có {unreadCount} thông báo chưa đọc
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Đánh dấu tất cả
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleDeleteAll}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa tất cả
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFilter('all');
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả ({notifications.length})
              </button>
              <button
                onClick={() => {
                  setFilter('unread');
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Chưa đọc ({unreadCount})
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Đang tải...</span>
            </div>
          </CardContent>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BellOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có thông báo</h3>
            <p className="text-gray-600">
              {filter === 'unread' ? 'Bạn đã đọc hết tất cả thông báo' : 'Chưa có thông báo nào'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md cursor-pointer ${
                !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`font-semibold ${
                          notification.isRead ? 'text-gray-900' : 'text-blue-900'
                        }`}
                      >
                        {notification.title}
                        {!notification.isRead && (
                          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>
                        )}
                      </h3>
                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-1">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Trang trước
              </Button>
              <span className="text-gray-600">
                Trang {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Trang sau
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsPage;
