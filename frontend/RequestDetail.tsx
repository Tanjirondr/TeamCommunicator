import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RequestDetails {
    id: string;
    title: string;
    description: string;
    createdBy: string;
    createdAt: string;
}

interface Comment {
    createdBy: string;
    message: string;
    createdAt: string;
}

const RequestDetail: React.FC<{ requestId: string }> = ({ requestId }) => {
    const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);