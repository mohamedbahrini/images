import {Thumb} from './thumb';
import {Comment} from './comment';

export class Post {
  posteid: number;
  text: string;
  username: string;
  title: string;
  date: string;
  comments: Comment[];
  thumbs: Thumb[];
  profilephoto: string;
}
