from django.db import models
import uuid
from django.utils import timezone
from django.db.models.signals import postpan_save
from django.dispatch import receiver

class TeamMember(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name

class SupportRequest(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('closed', 'Closed'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    team_member = models.ForeignKey(TeamMember, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    request_status = models.CharField(max_length=12, choices=STATUS_CHOICES, default='open')

    def __str__(self):
        return self.title

class SupportComment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    support_request = models.ForeignKey(SupportRequest, related_name='support_comments', on_delete=models.CASCADE)
    commented_by = models.ForeignKey(TeamMember, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Comment by {self.commented_by.name} on {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"

class SupportNotification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    support_request = models.ForeignKey(SupportRequest, on_delete=models.CASCADE)
    notified_team_member = models.ForeignKey(TeamMember, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    notification_read = models.BooleanField(default=False)

    def __str__(self):
        status = "Read" if self.notification_read else "Unread"
        return f"Notification for {self.notified_team_member.name} - {status}"

@receiver(post_save, sender=SupportComment)
def handle_new_support_comment_notification(sender, instance, created, **kwargs):
    if created:
        SupportNotification.objects.create(
            support_request=instance.support_request,
            notified_team_member=instance.support_request.teamMember,
            message=f"New comment on your request '{instance.support_request.title}' by {instance.commented_by.name}"
        )