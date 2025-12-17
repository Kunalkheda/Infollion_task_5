import axios from 'axios';
import { Question } from '@/types/index';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class Api {
  private client = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  async submitQuestions(questions: Question[]) {
    try {
      return (await this.client.post('/questions', { questions })).data;
    } catch (e) {
      console.error('Submit failed:', e);
      throw e;
    }
  }

  async getSubmissions() {
    try {
      return (await this.client.get('/submissions')).data;
    } catch (e) {
      console.error('Fetch failed:', e);
      throw e;
    }
  }

  async getSubmission(id: string) {
    try {
      return (await this.client.get(`/submissions/${id}`)).data;
    } catch (e) {
      console.error('Fetch failed:', e);
      throw e;
    }
  }

  async deleteSubmission(id: string) {
    try {
      return (await this.client.delete(`/submissions/${id}`)).data;
    } catch (e) {
      console.error('Delete failed:', e);
      throw e;
    }
  }

  async clearSubmissions() {
    try {
      return (await this.client.delete('/submissions')).data;
    } catch (e) {
      console.error('Clear failed:', e);
      throw e;
    }
  }

  async checkHealth() {
    try {
      const healthUrl = API_URL.replace('/api', '') + '/health';
      const res = await axios.get(healthUrl);
      return res.status === 200;
    } catch {
      return false;
    }
  }
}

export const apiClient = new Api();
