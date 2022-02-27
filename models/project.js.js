
module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define("Project",
        {
            project_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull:true,
                unique: true
            }
             ,
             email_manager:{
                type: DataTypes.STRING,
                allowNull:true,
                unique: true
             },
             emp_number: {
                type: DataTypes.STRING,
                allowNull:true,
            },
             pay: {
                 type: DataTypes.STRING,
                 allowNull:true,
             }
             ,project_money: {
                 type: DataTypes.STRING,
                 allowNull:true,
             }
             ,
             profit: {
                 type: DataTypes.STRING,
                 allowNull:true,
             }
            ,
            manmonth:{
                type: DataTypes.STRING,
                allowNull:true,
            },
              start_date: {
                  type: DataTypes.DATE,
                  allowNull: true
              },
              end_date: {
                  type: DataTypes.DATE,
                  allowNull:true,
              },
              foresee_end_date:{
                  type: DataTypes.DATE,
                  allowNull: true,
              },
             status: {
                 type: DataTypes.ENUM,
                 allowNull:true,
                 values: ['1', '2','3','4'],
                 defaultValue:'3',
                  comment: "1:hoàn thành,2:đang thi công,3:chuẩn bị thi công,4:hủy'"
             },
        },
    )
    return Project;
};
