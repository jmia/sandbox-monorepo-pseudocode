import httpClient from 'http-client';
import getAuthorizationFromEndpoint from '@sandbox-monorepo-pseudocode/common-api-functions';

export const fetchFormFolders = async (appSlug) => {
    const userData = localStorage.getItem('user');
    return getAuthorizationFromEndpoint('appSlug', userData).then((result) => {
        httpClient.fetch('categories', { appSlug });
    });
}