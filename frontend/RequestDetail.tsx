import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RequestInfo {
    id: string;
    title: string;
    description: string;
    createdBy: string;
    createdAt: string;
}

interface RequestComment {
    createdBy: string;
    message: string;
    createdAt: string;
}

const RequestDetailView: React.FC<{ requestId: string }> = ({ requestId }) => {
    const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);
    const [requestComments, setRequestExplicitComments] = useState<RequestComment[]>([]);
    
    return (
        <div>
        </div>
    );
};

export default RequestDetailView;