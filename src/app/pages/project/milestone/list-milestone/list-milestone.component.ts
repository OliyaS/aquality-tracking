import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.services';
import { Router, ActivatedRoute } from '@angular/router';
import { MilestoneService } from '../../../../services/milestones.service';
import { Milestone } from '../../../../shared/models/milestone';
import { TFColumn, TFColumnType } from '../../../../elements/table/tfColumn';
import { PermissionsService, EGlobalPermissions, ELocalPermissions } from '../../../../services/current-permissions.service';

@Component({
  templateUrl: './list-milestone.component.html',
  styleUrls: ['./list-milestone.component.css']
})
export class ListMilestoneComponent implements OnInit {

  constructor(
    public userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private milestoneService: MilestoneService,
    private permissions: PermissionsService
  ) { }

  hideModal = true;
  removeModalTitle: string;
  removeModalMessage: string;
  canEdit: boolean;
  milestones: Milestone[];
  milestoneToRemove: Milestone;
  columns: TFColumn[];
  projectId: number;

  public defSort = { property: 'name', order: 'desc' };

  async ngOnInit() {
    this.projectId = this.route.snapshot.params.projectId;
    this.milestones = await this.getMilestones();
    this.canEdit = await this.permissions.hasProjectPermissions(this.projectId,
      [EGlobalPermissions.manager], [ELocalPermissions.manager, ELocalPermissions.engineer]);
    this.columns = [
      {
        name: 'Id',
        property: 'id',
        sorting: true,
        type: TFColumnType.text,
        class: 'fit',
      }, {
        name: 'Name',
        property: 'name',
        filter: true,
        sorting: true,
        type: TFColumnType.text,
        editable: this.canEdit,
        creation: {
          creationLength: 500,
          required: true
        }
      }];
  }

  rowClicked(milestone: Milestone) {
    return this.router.navigate([`/project/${this.projectId}/milestone/${milestone.id}`]);
  }

  getMilestones() {
    return this.milestoneService.getMilestone({project_id: this.projectId});
  }

  async updateMilestone(milestone: Milestone) {
    milestone.project_id = this.projectId;
    await this.milestoneService.createMilestone(milestone);
    return this.milestoneService.handleSuccess(`The milestone '${milestone.name}' was updated.`);
  }

  async createMilestone(milestone: Milestone) {
    milestone.project_id = this.projectId;
    await this.milestoneService.createMilestone(milestone);
    return this.milestoneService.handleSuccess(`The milestone '${milestone.name}' was created.`);
  }

  async handleAction(event: { action: string, entity: Milestone }) {
    if (event.action === 'remove') {
      this.milestoneToRemove = event.entity;
      this.removeModalTitle = `Remove Milestone: ${event.entity.name}`;
      this.removeModalMessage = `Are you sure that you want to delete the '${
        event.entity.name
        }' Milestone? This action cannot be undone.`;
      this.hideModal = false;
    }
    if (event.action === 'create') {
      await this.createMilestone(event.entity);
      this.milestones = await this.getMilestones();
    }
  }

  async execute(decision: Promise<boolean>) {
    if (await decision) {
      await this.milestoneService.removeMilestone(this.milestoneToRemove);
      this.hideModal = true;
      this.milestones = await this.getMilestones();
    }
  }

  wasClosed(state: boolean) {
    this.hideModal = state;
  }
}
