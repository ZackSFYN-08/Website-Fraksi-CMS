import type { Schema, Struct } from '@strapi/strapi';

export interface MemberVoteBreakdown extends Struct.ComponentSchema {
  collectionName: 'components_member_vote_breakdowns';
  info: {
    description: '';
    displayName: 'Vote Breakdown';
    icon: 'chart-pie';
  };
  attributes: {
    kecamatan: Schema.Attribute.String & Schema.Attribute.Required;
    suara: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'member.vote-breakdown': MemberVoteBreakdown;
    }
  }
}
