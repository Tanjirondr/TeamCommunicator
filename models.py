# Assuming you have a list of comments to add; using SupportComment as an example
# This is a conceptual example and won't be directly applicable without adjustments to your workflow
support_comments = [SupportComment(support_request=some_request, commented_by=some_member, content=some_content) for _ in range(n)]
SupportComment.objects.bulk_create(support_comments)

# When fetching comments and you know you'll need support_request and commented_by data
comments = SupportComment.objects.select_related('support_request', 'commented_by').all()

from django.db.models.signals import post_save  # Corrected from postpan_save