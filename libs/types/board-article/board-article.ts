import { BoardArticleCategory, BoardArticleStatus } from '../../enums/board-article.enum';
import { MeLiked, TotalCounter } from '../car/cars';
import { Member } from '../member/member';

export interface Article {
	_id: string;
	articleCategory: BoardArticleCategory;
	articleStatus: BoardArticleStatus;
	articleTitle: string;
	articleContent: string;
	articleImage: string;
	articleViews: number;
	articleLikes: number;
	articleComments: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export type BoardArticle = Article;

export interface Articles {
	list: Article[];
	metaCounter: TotalCounter[];
}
