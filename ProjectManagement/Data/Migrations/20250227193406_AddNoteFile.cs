using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectManagement.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNoteFile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Header",
                table: "TaskCardNotes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "NoteFiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Bytes = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileType = table.Column<int>(type: "int", nullable: false),
                    TaskCardNoteId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteFiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NoteFiles_TaskCardNotes_TaskCardNoteId",
                        column: x => x.TaskCardNoteId,
                        principalTable: "TaskCardNotes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_NoteFiles_TaskCardNoteId",
                table: "NoteFiles",
                column: "TaskCardNoteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NoteFiles");

            migrationBuilder.DropColumn(
                name: "Header",
                table: "TaskCardNotes");
        }
    }
}
