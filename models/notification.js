
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification",
        {   id:{
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            notification: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            isRead: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue:'0'
            },
        },
    )
    
    Notification.associate = (models) => {
        models.Employee.hasMany(models.Notification, {
            foreignKey:"emp_id"
        })
    }
    return Notification;
};
