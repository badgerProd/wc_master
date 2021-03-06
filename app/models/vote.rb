class Vote < ActiveRecord::Base

  belongs_to :user
  belongs_to :relationship

  belongs_to :endorsement,  :class_name => 'Relationship', :foreign_key => 'relationship_id'
  belongs_to :contestation,  :class_name => 'Relationship', :foreign_key => 'relationship_id'
  belongs_to :endorser,  :class_name => 'User', :foreign_key => 'user_id'
  belongs_to :contester,  :class_name => 'User', :foreign_key => 'user_id'



  # validate uniqueness of the combination of relationship_id and user_is
  validates :relationship_id, :presence => true, :uniqueness => {:scope => [:user_id]}

end
