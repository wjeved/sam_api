import { gql } from 'apollo-server';

const typeDefs = gql`
  type Movie {
    id: Int!
    name: String!
    rating: Int!
  }

	type Member {
		id: Int!
		email: String!
		name: String!
		cash: Int!
		level: Int!
		jwt: String!
	}
	

	type Rst {
		rst: String!
	}

	type Idx {
		idx: Int!
	}
	
	type Trade {
		idx: Int!
		user: String!
		title: String!
		title2: String!
		content: String!
		addr1: String!
		addr2: String!
		wlike: Int!
		cmt: Int!
		view: Int!
		price: Int!
		wstatus: String!
		img1: String!
		img2: String!
		img3: String!
		img4: String!
		img5: String!
		date: String!
		nick: String!
		family: String!
		img: String!
		status: String!
		address: String!
		rdate: String!
		ulike: Int!
		cate1:String!
		cate2:String!
		cate3:String!
		qty:Int!
		oper:String!
		country:String!
		veh:String!
		year:String!
		speed:String!
		voltage:String!
		rating:String!
		output:String!
		cooling:String!
		dimension:String!
		weight:String!
		temp:String!
		op1:String!
		op2:String!
		op3:String!
		op4:String!
		op5:String!
		op6:String!
		op7:String!
		op8:String!
		op9:String!
		op10:String!
		op11:String!
		op12:String!
		op13:String!
		op14:String!
		op15:String!
		op16:String!
		op17:String!
		op18:String!
		op19:String!
		op20:String!
		eop1:String!
		eop2:String!
		eop3:String!
		eop4:String!
		eop5:String!
		eop6:String!
		eop7:String!
		eop8:String!
		eop9:String!
		eop10:String!
		eop11:String!
		eop12:String!
		eop13:String!
		eop14:String!
		eop15:String!
		eop16:String!
		eop17:String!
		eop18:String!
		eop19:String!
		eop20:String!
		opt1:String!
		opt2:String!
		opt3:String!
		opt4:String!
		opt5:String!
		opt6:String!
		opt7:String!
		opt8:String!
		opt9:String!
		opt10:String!
		opt11:String!
		opt12:String!
		opt13:String!
		opt14:String!
		opt15:String!
		opt16:String!
		opt17:String!
		opt18:String!
		opt19:String!
		opt20:String!
		opte1:String!
		opte2:String!
		opte3:String!
		opte4:String!
		opte5:String!
		opte6:String!
		opte7:String!
		opte8:String!
		opte9:String!
		opte10:String!
		opte11:String!
		opte12:String!
		opte13:String!
		opte14:String!
		opte15:String!
		opte16:String!
		opte17:String!
		opte18:String!
		opte19:String!
		opte20:String!
		description:String!
		descriptione:String!
	}

	type Plus {
		idx: Int!
		idx2: Int!
		type: String!
		title: String!
		title2: String!
		content: String!
		addr1: String!
		addr2: String!
		wlike: Int!
		cmt: Int!
		view: Int!
		price: Int!
		wstatus: String!
		img1: String!
		img2: String!
		img3: String!
		img4: String!
		img5: String!
		date: String!
		nick: String!
		family: String!
		img: String!
		status: String!
		address: String!
		rdate: String!
		ulike: Int!
		cate1:String!
		cate2:String!
		cate3:String!
		qty:Int!
		oper:String!
		country:String!
		veh:String!
		year:String!
		speed:String!
		voltage:String!
		rating:String!
		output:String!
		cooling:String!
		dimension:String!
		weight:String!
		temp:String!
	}

	type Inquire {
		idx: Int!
		idx2: Int!
		user: String!
		name: String!
		company: String!
		tel: String!
		title: String!
		title2: String!
		content: String!
		img1: String!
		status: String!
		cate1:String!
		cate2:String!
		cate3:String!
		qty:Int!
		oper:String!
		country:String!
		veh:String!
		year:String!
		speed:String!
		voltage:String!
		rating:String!
		output:String!
		cooling:String!
		dimension:String!
		weight:String!
		temp:String!
		cont:String!
		reply:String!
	}

	type Favor {
		idx: Int!
		idx2: Int!
		title: String!
		title2: String!
		img1: String!
		cate1:String!
		cate2:String!
		cate3:String!
	}

	type UserInfo {
		did:String!
		name:String!
		company:String!
		tel:String!
	}

	type DayDate {
		date: String!
	}

	type Category {
		name: String!
		description: String!
		img: String!
	}

	type Filter {
		name: String!
	}

  type Query {
    movies: [Movie!]!
    movie(id: Int!): Movie
  }

  type Mutation {
	trade(page:Int!, stx: String!, email: String!, cate1:String!, cate2:String!, cate3:String!): [Trade!]
	
	seltrade(idx:Int!, email: String!): Trade!
	
	signIn(email:String!, password:String!, key:String!): Member!
	signUp(email:String!, family: String!, nick: String!, pass: String!): Member!
	setUserInfo(did:String!, name:String!, company:String!, tel:String!): UserInfo!
	getUserInfo(did:String!): UserInfo!

	setInquire(did:String!, idx:Int!, content:String!): Rst!
	getInquire(did:String!, date:String!): [Inquire!]
	getInquire2(idx:Int!): Inquire!
	getInquireDate(did:String!): [DayDate!]
	getBanner(type:String!): [Plus!]
	getSub(cate1:String!, cate2:String!):[Category!]
	getFilter(type:String!):[Filter!]
	setFavor(did:String!, idx:Int!, type: String!):[Favor!]
	getFavor(did:String!):[Favor!]
  }
`;

export default typeDefs;
